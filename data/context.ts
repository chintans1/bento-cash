import { Context, createContext } from "react";
import { AppAccount, AppTransaction, AppCategory } from "../models/lunchmoney/appModels";

const defaultState = {
  lmApiKey: "",
  transactions: [],
  accounts: [],
  categories: []
}

type AppState = {
  lmApiKey: string;
  transactions: AppTransaction[];
  accounts: AppAccount[];
  categories: AppCategory[];
};

export const ParentContext: Context<AppState> = createContext(defaultState);