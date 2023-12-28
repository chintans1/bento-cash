import { useCallback, useEffect, useState } from "react";
import { AppState, ParentContext, defaultAppState, updateLmToken } from "./appContextProvider";
import { getValueFor } from "../../utils/secureStore";
import { LocalStorageKeys } from "../../models/enums/localStorageKeys";

// Create a AppProvider component to provide the context value to child components
export const AppProvider = ({ children } ) => {
  const [appState, setAppState] = useState<AppState>(defaultAppState);
  const [isReady, setIsReady] = useState(false);

  // Function to toggle the theme between light and dark
  const updateAppForNewToken = (newLmApiToken: string) => {
    updateLmToken(newLmApiToken).then(newerAppState => {
      setAppState(newerAppState);
    });
  };

  const initializeState = async () => {
    const lmValue = await getValueFor(LocalStorageKeys.LUNCH_MONEY_KEY);
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
      {children}
    </ParentContext.Provider>
  );
};