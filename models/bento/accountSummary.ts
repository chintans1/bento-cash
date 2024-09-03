export const accountSummaryTypes = [
  'checking',
  'investment',
  'debt',
  'unknown',
];
export type AccountSummaryType = (typeof accountSummaryTypes)[number];

export type AccountSummary = {
  name: string;
  currency: string;
  balance: number;
  changeMonthOverMonth: string;
  type: AccountSummaryType;
};
