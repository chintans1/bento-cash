import { AppAccount, AppTransaction } from "../models/lunchmoney/appModels";

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