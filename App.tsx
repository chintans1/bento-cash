import { StatusBar } from 'expo-status-bar';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import React, { createContext, useEffect, useState } from 'react';
import { getValueFor } from './utils/secureStore';
import { LocalStorageKeys } from './models/enums/localStorageKeys';
import Initialization from './screens/Initialization';
import Transactions from './screens/Transactions';
import { commonStyles } from './styles/commonStyles';
import Charts from './screens/Charts';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppState, ParentContext } from './data/context';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  bottomBar: {
    marginBottom: 10,
    padding: 15,
    justifyContent: "space-between",
    flexDirection: "row"
  }
});

const Stack = createNativeStackNavigator();

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [appState, setAppState] = useState<AppState | null>(null);
  //const [lmApiKey, setLmApiKey] = useState<string | null>("")
  // const [showTransactions, setTransactionsView] = useState(true);

  const initializeState = async () => {
    getValueFor(LocalStorageKeys.LUNCH_MONEY_KEY).then((lmValue) => {
      setAppState({ lmApiKey: lmValue });
      setIsReady(true);
    });
  }

  useEffect(() => {
    if (!isReady) {
      initializeState();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <ParentContext.Provider value={appState}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Transactions"
              component={Transactions}
            />
            <Stack.Screen
              name="Charts"
              component={Charts}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </ParentContext.Provider>
  );
}
/*
        <View style={{flex: 1}}>
          <StatusBar
            animated={true}
            style="auto"
          />
          {lmApiKey && lmApiKey.length > 0 ?
            <View style={commonStyles.container}>
              {showTransactions ?
                <Transactions lmApiKey={lmApiKey} />
              :
                <Charts lmApiKey={lmApiKey} />}
              <View style={styles.bottomBar}>
                <Button
                  title="Transactions"
                  onPress={() => setTransactionsView(true)}
                />
                <Button
                  title="Charts"
                  onPress={() => setTransactionsView(false)}
                />
              </View>
            </View>
          :
            <Initialization />}
        </View>
        */