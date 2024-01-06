import { AppAccount, AppDraftAccount, AppDraftTransaction } from "../models/lunchmoney/appModels";
import { SimpleFinAccount } from "../models/simplefin/account";
import { AccountsResponse } from "../models/simplefin/accounts";
import { SimpleFinTransaction } from "../models/simplefin/transaction";

export type SimpleFinImportData = {
  transactionsToImport: AppDraftTransaction[],
  accountsToImport: Map<string, AppDraftAccount>,
  syncedAccounts: Map<number, AppAccount>,
  totalAccounts: number
}

export const getImportData = (
  accountMappings: Map<string, string>,
  lmAccounts: Map<number, AppAccount>,
  accountsResponse: AccountsResponse): SimpleFinImportData =>
{
  const transactions: AppDraftTransaction[] = [];
  const unmatchedAccounts: Map<string, AppDraftAccount> = new Map();
  const syncedAccounts: Map<number, AppAccount> = new Map();

  for (const sfAccount of accountsResponse.accounts) {
    const accountTransactions = sfAccount.transactions;
    const mappingExists = accountMappings.has(sfAccount.id)
      && lmAccounts.has(parseInt(accountMappings.get(sfAccount.id)));
    // Accounts to import is any SF account ID that has no mapping
    if (!mappingExists) {
      unmatchedAccounts.set(sfAccount.id, {
        externalAccountId: sfAccount.id,
        accountName: sfAccount.name,
        institutionName: sfAccount.org.name || null,
        balance: sfAccount.balance,
        currency: sfAccount.currency.toLowerCase()
      });
    } else {
      sfAccount.lunchMoneyAccountId = parseInt(accountMappings.get(sfAccount.id));
      syncedAccounts.set(sfAccount.lunchMoneyAccountId, {
        ...lmAccounts.get(sfAccount.lunchMoneyAccountId),
        balance: sfAccount.balance
      });
    }

    accountTransactions.forEach(transaction =>
      transactions.push(parseTransaction(sfAccount, transaction)));
  }

  return {
    transactionsToImport: transactions,
    accountsToImport: unmatchedAccounts,
    syncedAccounts: syncedAccounts,
    totalAccounts: accountsResponse.accounts.length
  };
}

function parseTransaction(
  account: SimpleFinAccount,
  transaction: SimpleFinTransaction
): AppDraftTransaction {
  const date = new Date(transaction.posted * 1000);

  return {
    date: date.toISOString().split('T')[0],
    payee: transaction.payee || transaction.description,
    amount: transaction.amount,
    currency: account.currency.toLowerCase(),
    notes: transaction.description,
    status: transaction.pending ? "uncleared" : "cleared",
    externalId: transaction.id,
    externalAccountId: account.id,
    externalAccountName: account.name,
    lmAccountId: account.lunchMoneyAccountId || null,

    // User could decide
    //categoryId?: number,
    // categoryName?: string,
    // externalAccountId: string,
  }
}