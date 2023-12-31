import { useEffect, useState } from "react";
import { AppState, ParentContext, defaultAppState, updateLmToken } from "./appContextProvider";
import { getValueFor } from "../../utils/secureStore";
import { SecureStorageKeys } from "../../models/enums/storageKeys";
import Initialization from "../../screens/Initialization";

export const AppProvider = ({ children } ) => {
  const [appState, setAppState] = useState<AppState>(defaultAppState);
  const [isReady, setIsReady] = useState(false);

  const updateAppForNewToken = (newLmApiToken: string) => {
    updateLmToken(newLmApiToken).then(newerAppState => {
      setAppState(newerAppState);
    });
  };

  const initializeState = async () => {
    const lmValue = await getValueFor(SecureStorageKeys.LUNCH_MONEY_KEY);
    updateAppForNewToken(lmValue);
    setIsReady(true);
  }

  useEffect(() => {
    if (!isReady) {
      initializeState();
    }
  });

  if (!isReady) {
    return null;
  }

  return (
    <ParentContext.Provider value={{ appState: appState, updateLunchMoneyToken: updateAppForNewToken }}>
      {appState.lmApiKey.length === 0 ? <Initialization /> : children}
    </ParentContext.Provider>
  );
};