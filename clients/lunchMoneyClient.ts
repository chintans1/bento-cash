import { DraftTransaction, LunchMoney, Transaction } from 'lunch-money';
import { Environment } from '../models/enums/environment';

export class InternalLunchMoneyClient {
  token: string;
  lunchMoneyClient: LunchMoney;

  constructor(args: { token: string }) {
    this.token = args.token;
    this.lunchMoneyClient = new LunchMoney({ token: args.token });
  }

  getClient(): LunchMoney {
    return this.lunchMoneyClient;
  }

  createTransactions(draftTransactions: DraftTransaction[]) {
    return this.lunchMoneyClient.createTransactions(
      draftTransactions,
      true, // apply rules
      true, // check for recurring transactions
      true, // expenses is negative indeed
      true  // balance update is not needed, we should do that automatically
    );
  }

  async getAllTransactions() { // : Transaction[] {
    return await this.lunchMoneyClient.getTransactions();
  }
}

export default InternalLunchMoneyClient;