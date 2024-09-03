import { Asset, PlaidAccount } from 'lunch-money';
import { AppAccount, AppDraftAccount } from '../models/lunchmoney/appModels';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD', // TODO this can be set from the user API eventually

  // These options are needed to round to whole numbers if that's what you want.
  // minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  // maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

export const negativeCreditTypes: string[] = [
  'loan',
  'credit',
  'other liability',
];

export const formatBalance = (
  account: Asset | PlaidAccount | AppDraftAccount | AppAccount,
): string => {
  if ('type' in account && negativeCreditTypes.includes(account.type)) {
    // For credit accounts, negative balance is positive, positive is negative
    return (parseFloat(account.balance) * -1).toString();
  }
  if (
    'type_name' in account &&
    negativeCreditTypes.includes(account.type_name)
  ) {
    return (parseFloat(account.balance) * -1).toString();
  }

  return account.balance;
};

export const formatAmountString = (amount: number | string): string => {
  let amountToFormat: number;
  if (typeof amount === 'string') {
    amountToFormat = parseFloat(amount); // Convert string to number
  } else {
    amountToFormat = amount;
  }
  return formatter.format(amountToFormat);
};
