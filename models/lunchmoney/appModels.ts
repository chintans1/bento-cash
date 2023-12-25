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

  status: "cleared" | "uncleared" | "recurring" | "recurring_suggested";
}

export type AppAccount = {
  accountName: string;
  institutionName: string;
  type: string;
  state: string;
  balance: string;
  currency: string;
}

export type AppCategory = {
  id: number;
  name: string;
  is_income: boolean;
  is_group: boolean;
  group_id?: number;
}