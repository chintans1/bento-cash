import { Asset, DraftTransaction, LunchMoney, Transaction } from 'lunch-money';
import { AppAccount, AppDraftAccount } from '../models/lunchmoney/appModels';
import { formatBalance } from '../data/formatBalance';

// TODO: handle response format
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
    // TODO: handle batching
    return this.lunchMoneyClient.createTransactions(
      draftTransactions,
      true, // apply rules
      true, // check for recurring transactions
      true, // expenses is negative indeed
      true, // balance update is not needed, we should do that automatically
    );
  }

  async getAllTransactions() {
    const today = new Date();
    const thirtyDaysAgo = new Date(new Date().setDate(today.getDate() - 30));

    const response = await this.lunchMoneyClient.get('/v1/transactions', {
      pending: true,
      debit_as_negative: true,
      limit: 100,
      start_date: thirtyDaysAgo.toISOString().split('T')[0],
      end_date: today.toISOString().split('T')[0],
    });
    const { transactions } = response;
    return transactions.sort(
      (a: Transaction, b: Transaction) =>
        Date.parse(b.date) - Date.parse(a.date),
    );
  }

  // TODO: difference between this and accessClient?
  async getLunchMoneyInfo() {
    const response = await this.lunchMoneyClient.get('/v1/me');

    console.log(response);
    return {
      userId: response.user_id,
      userName: response.user_name,
      userEmail: response.user_email,
      budgetName: response.budget_name,
      apiKeyLabel: response.api_key_label || 'unknown',
    };
  }

  async createAccount(lmAccount: AppDraftAccount): Promise<Asset> {
    console.log(`Trying to create account ${lmAccount.accountName}`);
    return this.lunchMoneyClient.post('/v1/assets', {
      name: lmAccount.accountName,
      type_name: lmAccount.type,
      balance: lmAccount.balance,
      currency: lmAccount.currency.toLowerCase(),
      institution_name: lmAccount.institutionName,
    });
  }

  async updateAccountBalance(lmAccount: AppAccount) {
    formatBalance(lmAccount);
    return this.lunchMoneyClient.updateAsset({
      id: lmAccount.id,
      balance: lmAccount.balance,
    });
  }

  async updateDraftAccountBalance(lmAccount: AppDraftAccount) {
    formatBalance(lmAccount);
    if (lmAccount.lmAccountId === null) {
      // TODO: toast here?
      throw new Error('No account ID found for this account');
    }

    return this.lunchMoneyClient.updateAsset({
      id: lmAccount.lmAccountId,
      balance: lmAccount.balance,
    });
  }
}

export default InternalLunchMoneyClient;
