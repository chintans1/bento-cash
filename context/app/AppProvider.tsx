import { useEffect, useState } from "react";
import { AppState, ParentContext, defaultAppState, updateLmToken } from "./appContextProvider";
import { getValueFor } from "../../utils/secureStore";
import { SecureStorageKeys } from "../../models/enums/storageKeys";
import Initialization from "../../screens/Initialization";
import { ActivityIndicator, View } from "react-native";
import { brandingColours } from "../../styles/brandingConstants";

export const AppProvider = ({ children } ) => {
  const [appState, setAppState] = useState<AppState>(defaultAppState);
  const [isReady, setIsReady] = useState(false);

  const updateAppForNewToken = (newLmApiToken: string) => {
    updateLmToken(newLmApiToken).then(newerAppState => {
      setAppState(newerAppState);
      setIsReady(true);
    });
  };

  const initializeState = async () => {
    const lmValue = await getValueFor(SecureStorageKeys.LUNCH_MONEY_KEY);
    updateAppForNewToken(lmValue === null ? "" : lmValue);
  }

  useEffect(() => {
    if (!isReady) {
      initializeState();
    }
  }, [isReady]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color={brandingColours.primaryColour} />
      </View>
    )
  }

  return (
    <ParentContext.Provider value={{ appState: appState, updateLunchMoneyToken: updateAppForNewToken }}>
      {appState.lmApiKey.length === 0 ? <Initialization /> : children}
    </ParentContext.Provider>
  );
};