import { AppDraftAccount, AppDraftTransaction } from "../models/lunchmoney/appModels";
import { SimpleFinAccount } from "../models/simplefin/account";
import { AccountsResponse } from "../models/simplefin/accounts";
import { SimpleFinTransaction } from "../models/simplefin/transaction";

export type SimpleFinImportData = {
  transactionsToImport: AppDraftTransaction[],
  accountsToImport: AppDraftAccount[],
  totalAccounts: number
}

export const getImportData = (
  accountMappings: Map<string, string>, accountsResponse: AccountsResponse): SimpleFinImportData =>
{
  const transactions: AppDraftTransaction[] = [];
  const unmatchedAccounts: AppDraftAccount[] = [];

  for (const account of accountsResponse.accounts) {
    const accountTransactions = account.transactions;
    const mappingExists = accountMappings.has(account.id);
    // Accounts to import is any SF account ID that has no mapping
    if (!mappingExists) {
      unmatchedAccounts.push({
        accountName: account.name,
        institutionName: account.org.name || null,
        balance: account.balance,
        currency: account.currency.toLowerCase()
      });
    } else {
      account.lunchMoneyAccountId = parseInt(accountMappings.get(account.id));
    }

    accountTransactions.forEach(transaction =>
      transactions.push(parseTransaction(account, transaction)));
  }

  return {
    transactionsToImport: transactions,
    accountsToImport: unmatchedAccounts,
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
    lmAccountId: account.lunchMoneyAccountId || null,

    // User could decide
    //categoryId?: number,
    // categoryName?: string,
    // externalAccountId: string,
  }
}