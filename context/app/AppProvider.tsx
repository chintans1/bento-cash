import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import {
  AppState,
  ParentContext,
  defaultAppState,
  updateLmToken,
} from './appContextProvider';
import { getValueFor } from '../../utils/secureStore';
import { SecureStorageKeys } from '../../models/enums/storageKeys';
import Initialization from '../../screens/Initialization';
import BrandingColours from '../../styles/brandingConstants';

function AppProvider({ children }) {
  const [appState, setAppState] = useState<AppState>(defaultAppState);
  const [isReady, setIsReady] = useState(false);

  const updateAppForNewToken = useCallback((newLmApiToken: string) => {
    updateLmToken(newLmApiToken).then(newerAppState => {
      setAppState(newerAppState);
      setIsReady(true);
    });
  }, []);

  useEffect(() => {
    const initializeState = async () => {
      const lmValue = await getValueFor(SecureStorageKeys.LUNCH_MONEY_KEY);
      updateAppForNewToken(lmValue === null ? '' : lmValue);
    };

    if (!isReady) {
      initializeState();
    }
  }, [isReady, updateAppForNewToken]);

  const contextValue = useMemo(
    () => ({
      appState,
      updateLunchMoneyToken: updateAppForNewToken,
    }),
    [appState, updateAppForNewToken],
  );

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={BrandingColours.primaryColour} />
      </View>
    );
  }

  return (
    <ParentContext.Provider value={contextValue}>
      {appState.lmApiKey.length === 0 ? <Initialization /> : children}
    </ParentContext.Provider>
  );
}

export default AppProvider;
