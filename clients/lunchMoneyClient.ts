import { DraftTransaction, LunchMoney } from 'lunch-money';
import { Environment } from '../models/enums/environment';

const lunchMoney = new LunchMoney( { token: Environment.LUNCH_MONEY_TOKEN } );

export function getClient(): LunchMoney {
  return lunchMoney;
}

export async function createTransactions(draftTransactions: DraftTransaction[]) {
  return lunchMoney.createTransactions(
    draftTransactions,
    true, // apply rules
    true, // check for recurring transactions
    true, // expenses is negative indeed
    true  // balance update is not needed, we should do that automatically
  );
}