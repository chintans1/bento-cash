export type AppTransaction = {
  id: number;
  date: string;
  payee: string;
  amount: string;
  currency: string;
  notes: string;

  categoryId?: number;
  assetId?: number;
  assetName?: string;
  categoryName?: string;

  status: "cleared" | "uncleared" | "recurring" | "recurring_suggested" | "pending";
}

export const accountTypes = ["employee compensation", "cash", "vehicle", "loan", "cryptocurrency", "investment", "other", "credit", "real estate"];
export type AccountType = typeof accountTypes[number];

export type AppAccount = {
  id: number;
  accountName: string;
  institutionName: string;
  type: string;
  state: string;
  balance: string;
  currency: string;
}

export type AppDraftAccount = {
  externalAccountId: string;
  accountName: string;
  institutionName?: string;
  type?: string;
  balance: string;
  currency: string;
  importable?: boolean;
}

export type AppCategory = {
  id: number;
  name: string;
  isIncome: boolean;
  isGroup: boolean;
  groupId?: number;
}

export type AppLunchMoneyInfo = {
  userId:	number;
  userName: string;
  userEmail: string;
  budgetName: string;
  apiKeyLabel?: string;
}

export type AppDraftTransaction = {
  date: string;
	payee: string;
	amount: string;
	currency: string;
	notes?: string;
  status: "cleared" | "uncleared";
  externalId: string;

  // User could decide
	categoryId?: number;
  categoryName?: string;

  lmAccountId?: number;
  externalAccountId: string;
  externalAccountName: string;

  importable?: boolean;
}