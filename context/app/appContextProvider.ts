import { Context, createContext, useContext } from "react";
import { AppAccount, AppTransaction, AppCategory } from "../../models/lunchmoney/appModels";
import InternalLunchMoneyClient from "../../clients/lunchMoneyClient";
import { getAccountsMap, getCategoriesMap, getTransactionsForApp } from "../../data/transformLunchMoney";
import { save } from "../../utils/secureStore";
import { SecureStorageKeys } from "../../models/enums/storageKeys";
import { accessClient } from "../../clients/accessClient";

export const defaultAppState = {
  lmApiKey: "",
  transactions: [],
  accounts: new Map<number, AppAccount>(),
  categories: []
}

export type AppState = {
  lmApiKey: string;
  transactions: AppTransaction[];
  accounts: Map<number, AppAccount>;
  categories: AppCategory[];
};

export type ParentAppState = {
  appState: AppState;
  updateLunchMoneyToken: (newLmToken: string) => void;
}

export const ParentContext: Context<ParentAppState> = createContext({
  appState: defaultAppState,
  updateLunchMoneyToken: () => {}
});

export const useParentContext = () => {
  // get the context
  const context = useContext(ParentContext);

  // if `undefined`, throw an error
  if (context === undefined) {
    throw new Error("Parent Context is not available or being used outside of its provider");
  }

  return context;
}

// This should be used as the value of updateLunchMoneyToken() in ParentAppState
export const updateLmToken = async (newToken: string) => {
  if (newToken === null || newToken.length <= 0) {
    return defaultAppState;
  }

  const isTokenValid = await accessClient.isTokenValid(newToken);

  if (!isTokenValid) {
    return defaultAppState;
  }

  const lunchMoneyClient = new InternalLunchMoneyClient({ token: newToken });

  const accounts = await getAccountsMap(lunchMoneyClient);
  const categories = await getCategoriesMap(lunchMoneyClient);
  // We have the API key so lets fetch everything we can and process it
  // We have to fetch accounts and categories first
  const transactions = await getTransactionsForApp(lunchMoneyClient, accounts, categories);

  await save(SecureStorageKeys.LUNCH_MONEY_KEY, newToken);

  return {
    lmApiKey: newToken,
    transactions: transactions,
    accounts: accounts,
    categories: Array.from(categories.values())
  }
}