import { AppAccount, AppDraftAccount, AppDraftTransaction, AppTransaction, ImportAccount } from "../models/lunchmoney/appModels";
import { SimpleFinImportData } from "./transformSimpleFin";

const groupAccountByInstitution = (accounts: AppAccount[]): { [key: string]: AppAccount[]} => {
  return accounts.reduce((acc, item) => {
    const institution = item.institutionName;
    if (!acc[institution]) {
      acc[institution] = [];
    }
    acc[institution].push(item);
    return acc;
  }, {} as { [key: string]: AppAccount[] });
}

export const getGroupedAccountsByInstitution = (accounts: AppAccount[]): { title: string, data: AppAccount[]}[] => {
  const groupedTransactions = groupAccountByInstitution(accounts);

  return Object.keys(groupedTransactions)
    .map(institutionName => ({
      title: institutionName,
      data: groupedTransactions[institutionName]
    })
  );
}

const groupTransactionsByDate = (transactions: AppTransaction[]): { [key: string]: AppTransaction[]} => {
  return transactions.reduce((acc, item) => {
    const date = item.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as { [key: string]: AppTransaction[] });
}

export const getGroupedTransactionsByDate = (transactions: AppTransaction[]): { title: string, data: AppTransaction[]}[] => {
  const groupedTransactions = groupTransactionsByDate(transactions);

  return Object.keys(groupedTransactions)
    .map(date => ({
      title: date,
      data: groupedTransactions[date]
    })
  );
}

// For Simplefin importing
const groupDraftAccountsByInstitution = (draftAccounts: AppDraftAccount[]): { [key: string]: AppDraftAccount[]} => {
  return draftAccounts.reduce((acc, item) => {
    const institutionName = item.institutionName ?? "Unknown";
    if (!acc[institutionName]) {
      acc[institutionName] = [];
    }
    acc[institutionName].push(item);
    return acc;
  }, {} as { [key: string]: AppDraftAccount[] });
}

export const getGroupedAccountsForImport = (importData: SimpleFinImportData): { title: string, data: ImportAccount[]}[] => {
  const groupedDraftAccounts = getGroupedDraftAccountsByInstitution(Array.from(importData.accountsToImport.values()));

  groupedDraftAccounts.push({title: "Synced Accounts", data: Array.from(importData.syncedAccounts.values())});

  return groupedDraftAccounts;
}

export const getGroupedDraftAccountsByInstitution = (draftAccounts: AppDraftAccount[]): { title: string, data: ImportAccount[]}[] => {
  const groupedAccounts = groupDraftAccountsByInstitution(draftAccounts);

  return Object.keys(groupedAccounts)
    .map(institution => ({
      title: institution,
      data: groupedAccounts[institution]
    })
  );
}

const groupDraftTransactionsByAccount = (draftTransactions: AppDraftTransaction[]): { [key: string]: AppDraftTransaction[]} => {
  return draftTransactions.reduce((acc, item) => {
    const accountName = item.externalAccountName;
    if (!acc[accountName]) {
      acc[accountName] = [];
    }
    acc[accountName].push(item);
    return acc;
  }, {} as { [key: string]: AppDraftTransaction[] });
}

export const getGroupedDraftTransactionsByAccount = (draftTransactions: AppDraftTransaction[]): { title: string, data: AppDraftTransaction[]}[] => {
  const groupedTransactions = groupDraftTransactionsByAccount(draftTransactions);

  return Object.keys(groupedTransactions)
    .map(accountName => ({
      title: accountName,
      data: groupedTransactions[accountName]
    })
  );
}