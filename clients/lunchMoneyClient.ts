import { Asset, DraftTransaction, LunchMoney } from 'lunch-money';
import { AppDraftAccount, AppLunchMoneyInfo } from '../models/lunchmoney/appModels';

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
      true  // balance update is not needed, we should do that automatically
    );
  }

  async getAllTransactions() { // : Transaction[] {
    return await this.lunchMoneyClient.getTransactions();
  }

  async getLunchMoneyInfo() {
    const response = await this.lunchMoneyClient.get("/v1/me");

    return {
      userId:	response.user_id,
      userName: response.user_name,
      userEmail: response.user_email,
      budgetName: response.budget_name,
      apiKeyLabel: response.api_key_label || "unknown"
    }
  }

  async getLunchMoneyInfoForToken(newToken: string) {
    this.lunchMoneyClient.token = newToken;
    const lunchMoneyInfo: AppLunchMoneyInfo = await this.getLunchMoneyInfo();

    this.lunchMoneyClient.token = this.token;
    return lunchMoneyInfo;
  }

  async createAccount(lmAccount: AppDraftAccount): Promise<Asset> {
    console.log(`Trying to create account ${lmAccount.accountName}`);
    return await this.lunchMoneyClient.post("/v1/assets", {
      "name": lmAccount.accountName,
      "type_name": lmAccount.type,
      "balance": lmAccount.balance,
      "currency": lmAccount.currency.toLowerCase(),
      "institution_name": lmAccount.institutionName
    });
  }
}

export default InternalLunchMoneyClient;