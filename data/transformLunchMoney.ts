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
} from '../models/lunchmoney/appModels';
import { formatBalance } from './formatBalance';

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
    accountsMap.set(account.id, {
      id: account.id,
      accountName: formatAccountName(account),
      institutionName: account.institution_name || 'Unknown',
      fullName: formatFullAccountName(account),
      type: account.type_name,
      state: 'open',
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
      state: 'open',
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
