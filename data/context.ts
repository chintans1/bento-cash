import { createContext } from "react";

const defaultState = {
  lmApiKey: ""
}
type AppState = typeof defaultState;

const defaultAppState = {
  // async doRpcCall(method, args) { return new Promise(() => null); } // never complete by default }
}
// type RpcContextData = typeof defaultRpcContext;

export const ParentContext = createContext(null);