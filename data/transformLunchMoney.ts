import {
  Asset,
  DraftTransaction,
  PlaidAccount,
  Transaction,
} from 'lunch-money';
import InternalLunchMoneyClient from '../clients/lunchMoneyClient';
import {
  AppAccount,
  AppCategory,
  AppDraftTransaction,
  AppTransaction,
  BudgetSummary,
} from '../models/lunchmoney/appModels';
import { formatBalance } from './formatBalance';

type BudgetCategoryInfo = {
  categoryName: string;
  categoryGroupName?: string;
  id: number;
  expectedAmount?: number;
  actualAmount?: number;
  isIncome: boolean;
  isGroup: boolean;
  groupId?: number;
};

const formatAccountName = (account: Asset | PlaidAccount): string => {
  const accountNameToUse =
    'display_name' in account && account.display_name?.length > 0
      ? account.display_name
      : account.name;
  let formattedAccountName: string = accountNameToUse;

  if (accountNameToUse.startsWith(`${account.institution_name} `)) {
    formattedAccountName = accountNameToUse
      .substring(account.institution_name.length)
      .trim();
  }
  return formattedAccountName?.length > 0 ? formattedAccountName : account.name;
};

const formatFullAccountName = (account: Asset | PlaidAccount): string => {
  if ('display_name' in account && account.display_name?.length > 0) {
    return account.display_name;
  }

  if (account.institution_name?.length > 0) {
    return `${account.institution_name} ${account.name}`;
  }
  return account.name;
};

export const getTransactionsForWholeYear = async (
  lmClient: InternalLunchMoneyClient,
  categories: Map<number, AppCategory>,
) => {
  const lmTransactions = await lmClient.getTransactionsForWholeYear();

  const appTransactions: AppTransaction[] = [];

  lmTransactions.forEach(transaction => {
    const groupTransaction: boolean = transaction.group_id != null;
    const splitTransaction: boolean | unknown =
      'has_children' in transaction ? transaction.has_children : false;
    const assetId: number =
      transaction.asset_id != null
        ? transaction.asset_id
        : transaction.plaid_account_id;

    if (!splitTransaction && !groupTransaction) {
      appTransactions.push({
        id: transaction.id,
        date: transaction.date,
        payee: transaction.payee,
        amount: transaction.amount,
        currency: transaction.currency,
        notes: transaction.notes,

        assetId,
        assetName: undefined,

        categoryId: transaction.category_id,
        categoryName: categories.get(transaction.category_id)?.name,

        isIncome: transaction.is_income,
        excludeFromTotals: transaction.exclude_from_totals,

        isGrouped: transaction.is_group,
        isSplit: transaction.parent_id != null,

        status: transaction.status,
      });
    }
  });

  return appTransactions;
};

export const getTransactionsForApp = async (
  lmClient: InternalLunchMoneyClient,
  accounts: Map<number, AppAccount>,
  categories: Map<number, AppCategory>,
) => {
  const lmTransactions: Transaction[] = await lmClient.getAllTransactions();
  const appTransactions: AppTransaction[] = [];

  lmTransactions.forEach(transaction => {
    const assetId: number =
      transaction.asset_id != null
        ? transaction.asset_id
        : transaction.plaid_account_id;
    const groupTransaction: boolean = transaction.group_id != null;
    const splitTransaction: boolean | unknown =
      'has_children' in transaction ? transaction.has_children : false;

    if (!splitTransaction && !groupTransaction) {
      appTransactions.push({
        id: transaction.id,
        date: transaction.date,
        payee: transaction.payee,
        amount: transaction.amount,
        currency: transaction.currency,
        notes: transaction.notes,

        assetId,
        assetName:
          assetId != null ? accounts.get(assetId)?.fullName : undefined,

        categoryId: transaction.category_id,
        categoryName: categories.get(transaction.category_id)?.name,

        isIncome:
          'is_income' in transaction &&
          typeof transaction.is_income === 'boolean'
            ? transaction.is_income
            : false,
        excludeFromTotals:
          'exclude_from_totals' in transaction &&
          typeof transaction.exclude_from_totals === 'boolean'
            ? transaction.exclude_from_totals
            : false,

        isGrouped: transaction.is_group,
        isSplit: transaction.parent_id != null,

        status: transaction.status,
      });
    }
  });

  return appTransactions;
};

export const getAccountsMap = async (lmClient: InternalLunchMoneyClient) => {
  const manualAccounts = await lmClient.getClient().getAssets();
  const plaidAccounts = await lmClient.getClient().getPlaidAccounts();
  const accountsMap = new Map<number, AppAccount>();

  manualAccounts.forEach(account => {
    const state = account.closed_on ? 'closed' : 'open';
    accountsMap.set(account.id, {
      id: account.id,
      accountName: formatAccountName(account),
      institutionName: account.institution_name || 'Unknown',
      fullName: formatFullAccountName(account),
      type: account.type_name,
      state,
      balance: formatBalance(account),
      currency: account.currency,
    });
  });

  plaidAccounts.forEach(account => {
    accountsMap.set(account.id, {
      id: account.id,
      accountName: formatAccountName(account),
      institutionName: account.institution_name || 'Unknown',
      fullName: formatFullAccountName(account),
      type: account.type,
      state: account.status === 'inactive' ? 'closed' : 'open',
      balance: formatBalance(account),
      currency: account.currency,
    });
  });

  return accountsMap;
};

export const getCategoriesMap = async (lmClient: InternalLunchMoneyClient) => {
  const categories = await lmClient.getClient().getCategories();
  const categoriesMap = new Map<number, AppCategory>();

  categories.forEach(category => {
    categoriesMap.set(category.id, {
      id: category.id,
      name: category.name,
      isIncome: category.is_income,
      isGroup: category.is_group,
      groupId: category.group_id,
    });
  });

  return categoriesMap;
};

export const getDraftTransactions = (
  appDraftTransactions: AppDraftTransaction[],
): DraftTransaction[] => {
  const draftTransactions: DraftTransaction[] = [];

  appDraftTransactions.forEach(transaction => {
    draftTransactions.push({
      date: transaction.date,
      category_id: transaction.categoryId,
      payee: transaction.payee,
      amount: transaction.amount,
      currency: transaction.currency.toLowerCase(),
      notes: transaction.notes,
      asset_id: transaction.lmAccountId,
      status: transaction.status,
      external_id: transaction.externalId,
    });
  });
  return draftTransactions;
};

const getBudgetCategoryInfo = (
  category,
  currentMonth: string,
): BudgetCategoryInfo => {
  return {
    id: category.category_id,
    categoryName: category.category_name,
    categoryGroupName: category.category_group_name,
    expectedAmount: category.data[currentMonth].budget_to_base
      ? parseFloat(category.data[currentMonth].budget_to_base)
      : undefined,
    actualAmount: category.data[currentMonth].spending_to_base
      ? parseFloat(category.data[currentMonth].spending_to_base)
      : undefined,
    isIncome: category.is_income,
    isGroup: category.is_group,
    groupId: category.is_group ? category.group_id : undefined,
  };
};

const getBudgetCategoryInfoMap = (
  budgetData,
): Map<BudgetCategoryInfo, BudgetCategoryInfo[]> => {
  const categoryInfoMap = new Map<BudgetCategoryInfo, BudgetCategoryInfo[]>();
  const groupsMap: Map<number, BudgetCategoryInfo> = new Map<
    number,
    BudgetCategoryInfo
  >();

  // Gather all the category groups
  const groups = budgetData.filter(category => category.is_group);
  groups.forEach(group => {
    if (group.data) {
      const currentMonth = Object.keys(group.data)[0]; // Most recent month
      const categoryInfo = getBudgetCategoryInfo(group, currentMonth);
      categoryInfoMap.set(categoryInfo, []);
      groupsMap.set(group.category_id, categoryInfo);
    }
  });

  // Gather all non-group categories
  const categories = budgetData.filter(category => !category.is_group);
  categories.forEach(category => {
    if (category.data) {
      const currentMonth = Object.keys(category.data)[0]; // Most recent month
      const categoryInfo = getBudgetCategoryInfo(category, currentMonth);

      if (category.group_id && groupsMap.has(category.group_id)) {
        const existingCategories = categoryInfoMap.get(
          groupsMap.get(category.group_id),
        );
        existingCategories.push(categoryInfo);

        categoryInfoMap.set(
          groupsMap.get(category.group_id),
          existingCategories,
        );
      } else {
        categoryInfoMap.set(categoryInfo, []);
      }
    }
  });

  return categoryInfoMap;
};

export const getBudgetSummary = async (
  lmClient: InternalLunchMoneyClient,
  startDate: Date,
  endDate: Date,
): Promise<BudgetSummary> => {
  const budgetData = await lmClient.getBudgetData(startDate, endDate);
  const categoryInfos: Map<BudgetCategoryInfo, BudgetCategoryInfo[]> =
    getBudgetCategoryInfoMap(budgetData);

  const budgetSummary: BudgetSummary = {
    expectedExpenses: 0,
    actualExpenses: 0,
    expectedIncome: 0,
    actualIncome: 0,
  };

  /*
    I have a map of groups -> categories under group
    It is possible for a key to have no categories under it, its just a category on its own
    Categories have the summed up actual values at the group level
    Categories have the expected values either at the group level or at each individual category level
    We need to return BudgetSummary with the summed up values of expected and actual expenses + income
  */

  categoryInfos.forEach((categories, group) => {
    let setExpectedAtGroup: boolean = false;
    if (group.expectedAmount !== undefined) {
      if (group.isIncome) {
        budgetSummary.expectedIncome += group.expectedAmount;
      } else {
        budgetSummary.expectedExpenses += group.expectedAmount;
      }
      setExpectedAtGroup = true;
    }

    let setActualAtGroup: boolean = false;
    if (group.actualAmount !== undefined) {
      if (group.isIncome) {
        budgetSummary.actualIncome += Math.abs(group.actualAmount);
      } else {
        budgetSummary.actualExpenses += group.actualAmount;
      }
      setActualAtGroup = true;
    }

    categories.forEach(category => {
      if (!setExpectedAtGroup && category.expectedAmount !== undefined) {
        if (category.isIncome) {
          budgetSummary.expectedIncome += category.expectedAmount;
        } else {
          budgetSummary.expectedExpenses += category.expectedAmount;
        }
      }

      if (!setActualAtGroup && category.actualAmount !== undefined) {
        if (category.isIncome) {
          budgetSummary.actualIncome += Math.abs(group.actualAmount);
        } else {
          budgetSummary.actualExpenses += category.actualAmount;
        }
      }
    });
  });

  return budgetSummary;
};
