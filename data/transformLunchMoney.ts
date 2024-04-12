import { Asset, DraftTransaction, PlaidAccount } from "lunch-money";
import InternalLunchMoneyClient from "../clients/lunchMoneyClient";
import { AppAccount, AppCategory, AppDraftTransaction, AppTransaction } from "../models/lunchmoney/appModels";

const formatBalance = (account: Asset | PlaidAccount): string => {
  if ('type' in account && account.type === "credit") {
    // For credit accounts, negative balance is positive, positive is negative
    return (parseFloat(account.balance) * -1).toString();
  } else if ('type_name' in account && account.type_name === "credit") {
    return (parseFloat(account.balance) * -1).toString();
  }

  return account.balance;
}

export const getTransactionsForApp = async (
  lmClient: InternalLunchMoneyClient,
  accounts: Map<number, AppAccount>,
  categories: Map<number, AppCategory>) => {
  const lmTransactions = await lmClient.getAllTransactions();
  const appTransactions: AppTransaction[] = [];

  lmTransactions.forEach(transaction => {
    appTransactions.push({
      id: transaction.id,
      date: transaction.date,
      payee: transaction.payee,
      amount: transaction.amount,
      currency: transaction.currency,
      notes: transaction.notes,

      assetId: transaction.asset_id,
      assetName: transaction.asset_id != null ?
      accounts.get(transaction.asset_id)?.accountName : undefined,

      categoryId: transaction.category_id,
      categoryName: categories.get(transaction.category_id)?.name,

      status: transaction.status
    });
  });

  return appTransactions;
}

export const getAccountsMap = async (lmClient: InternalLunchMoneyClient) => {
  const manualAccounts = await lmClient.getClient().getAssets();
  const plaidAccounts = await lmClient.getClient().getPlaidAccounts();
  const accountsMap = new Map<number, AppAccount>();

  for (const account of manualAccounts) {
    accountsMap.set(account.id, {
      id: account.id,
      accountName: account.name,
      institutionName: account.institution_name || "Unknown",
      type: account.type_name,
      state: "open",
      balance: formatBalance(account),
      currency: account.currency
    });
  }

  for (const account of plaidAccounts) {
    accountsMap.set(account.id, {
      id: account.id,
      accountName: account.name,
      institutionName: account.institution_name || "Unknown",
      type: account.type,
      state: "open",
      balance: formatBalance(account),
      currency: account.currency
    });
  }

  return accountsMap;
}

export const getCategoriesMap = async (lmClient: InternalLunchMoneyClient) => {
  const categories = await lmClient.getClient().getCategories();
  const categoriesMap = new Map<number, AppCategory>();

  for (const category of categories) {
    categoriesMap.set(category.id, {
      id: category.id,
      name: category.name,
      isIncome: category.is_income,
      isGroup: category.is_group,
      groupId: category.group_id
    });
  }

  return categoriesMap;
}

export const getDraftTransactions = (appDraftTransactions: AppDraftTransaction[]): DraftTransaction[] => {
  const draftTransactions: DraftTransaction[] = [];
  for (const transaction of appDraftTransactions) {
    draftTransactions.push({
      date: transaction.date,
      category_id: transaction.categoryId,
      payee: transaction.payee,
      amount: transaction.amount,
      currency: transaction.currency.toLowerCase(),
      notes: transaction.notes,
      asset_id: transaction.lmAccountId,
      status: transaction.status,
      external_id: transaction.externalId
    })
  }
  return draftTransactions;
}