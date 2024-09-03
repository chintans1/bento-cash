import {
  AccountSummary,
  AccountSummaryType,
} from '../models/bento/accountSummary';
import { AppAccount } from '../models/lunchmoney/appModels';

const orderedAccountTypes: AccountSummaryType[] = [
  'checking',
  'investment',
  'debt',
];

const getTypeOfAccount = (account: AppAccount): AccountSummaryType => {
  switch (account.type?.toLowerCase()) {
    case 'cash':
    case 'checking':
      return 'checking';
    case 'employee compensation':
    case 'cryptocurrency':
    case 'other asset':
    case 'real estate':
    case 'vehicle':
    case 'investment':
      return 'investment';
    case 'credit':
    case 'other liability':
    case 'loan':
      return 'debt';
    default:
      return 'unknown';
  }
};

export const getAccountsSummary = (
  accountsMap: Map<number, AppAccount>,
): AccountSummary[] => {
  // We will need to sift through all the accounts and combine for checking, investment and debt
  const allAccounts = Array.from(accountsMap.values());

  const accountSummaries: Record<AccountSummaryType, AccountSummary> =
    allAccounts.reduce(
      (acc, account) => {
        const accountType = getTypeOfAccount(account);

        if (!acc[accountType]) {
          acc[accountType] = {
            name: accountType.charAt(0).toUpperCase() + accountType.slice(1),
            balance: 0,
            currency: 'USD',
            changeMonthOverMonth: '0%',
            type: accountType,
          };
        }

        acc[accountType] = {
          ...acc[accountType],
          balance: acc[accountType].balance + parseFloat(account.balance),
        };

        return acc;
      },
      {} as Record<AccountSummaryType, AccountSummary>,
    );

  // Return the account summaries in the specified order
  return orderedAccountTypes
    .filter(type => accountSummaries[type])
    .map(type => accountSummaries[type]);
};
