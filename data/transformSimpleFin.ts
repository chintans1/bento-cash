import {
  AppAccount,
  AppDraftAccount,
  AppDraftTransaction,
} from '../models/lunchmoney/appModels';
import { SimpleFinAccount } from '../models/simplefin/account';
import { AccountsResponse } from '../models/simplefin/accounts';
import { SimpleFinTransaction } from '../models/simplefin/transaction';

export type SimpleFinImportData = {
  transactionsToImport: AppDraftTransaction[];
  accountsToImport: Map<string, AppDraftAccount>;
  syncedAccounts: Map<number, AppAccount>;
  totalAccounts: number;
  lastImportDate?: Date;
};

function parseTransaction(
  account: SimpleFinAccount,
  transaction: SimpleFinTransaction,
): AppDraftTransaction {
  const date = new Date(transaction.posted * 1000);

  return {
    date: date.toISOString().split('T')[0],
    payee: transaction.payee || transaction.description,
    amount: transaction.amount,
    currency: account.currency.toLowerCase(),
    notes: transaction.description,
    status: transaction.pending ? 'uncleared' : 'cleared',
    externalId: transaction.id,
    externalAccountId: account.id,
    externalAccountName: account.name,
    lmAccountId: account.lunchMoneyAccountId || null,
  };
}

export const getImportData = (
  accountMappings: Map<string, string>,
  lmAccounts: Map<number, AppAccount>,
  accountsResponse: AccountsResponse,
): SimpleFinImportData => {
  const transactions: AppDraftTransaction[] = [];
  const unmatchedAccounts: Map<string, AppDraftAccount> = new Map();
  const syncedAccounts: Map<number, AppAccount> = new Map();

  accountsResponse.accounts.forEach(sfAccount => {
    const {
      transactions: accountTransactions,
      id,
      name,
      org,
      balance,
      currency,
    } = sfAccount;
    let updatedSfAccount = {
      ...sfAccount,
    };

    const mappingExists =
      accountMappings.has(id) &&
      lmAccounts.has(parseInt(accountMappings.get(id), 10));

    // Accounts to import is any SF account ID that has no mapping
    if (!mappingExists) {
      unmatchedAccounts.set(id, {
        externalAccountId: id,
        accountName: name,
        institutionName: org.name || null,
        balance,
        currency: currency.toLowerCase(),
      });
    } else {
      const lunchMoneyAccountId = parseInt(accountMappings.get(id), 10);
      updatedSfAccount = {
        ...sfAccount,
        lunchMoneyAccountId,
        balance,
      };
      syncedAccounts.set(lunchMoneyAccountId, {
        ...lmAccounts.get(lunchMoneyAccountId),
        balance,
      });
    }

    accountTransactions.forEach(transaction =>
      transactions.push(parseTransaction(updatedSfAccount, transaction)),
    );
  });

  return {
    transactionsToImport: transactions,
    accountsToImport: unmatchedAccounts,
    syncedAccounts,
    totalAccounts: accountsResponse.accounts.length,
  };
};

// TODO: take in account mappings
export const getParsedTransactions = (
  accountsResponse: AccountsResponse,
): AppDraftTransaction[] => {
  const transactions: AppDraftTransaction[] = [];

  accountsResponse.accounts.forEach(sfAccount => {
    const accountTransactions = sfAccount.transactions;
    accountTransactions.forEach(transaction =>
      transactions.push(parseTransaction(sfAccount, transaction)),
    );
  });

  return transactions;
};
