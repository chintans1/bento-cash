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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import InternalLunchMoneyClient from './clients/lunchMoneyClient';
import { AppAccount, AppTransaction } from './models/lunchmoney/appModels';

const styles = StyleSheet.create({
  bottomBar: {
    marginBottom: 10,
    padding: 15,
    justifyContent: "space-between",
    flexDirection: "row"
  }
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [appState, setAppState] = useState<AppState | null>(null);
  //const [lmApiKey, setLmApiKey] = useState<string | null>("")
  // const [showTransactions, setTransactionsView] = useState(true);

  const getTransactionsForApp = async (lmClient: InternalLunchMoneyClient, accounts: Map<number, AppAccount>) => {
    const lmTransactions = await lmClient.getAllTransactions();
    const appTransactions: AppTransaction[] = [];

    lmTransactions.forEach(transaction => {
      appTransactions.push({
        id: transaction.id,
        date: transaction.date,
        payee: transaction.payee,
        amount: transaction.amount,
        currency: transaction.currency,
        notes: transaction.notes,

        // categoryId?: number;
        assetId: transaction.asset_id,
        assetName: transaction.asset_id != null ?
          accounts.get(transaction.asset_id)?.accountName : undefined,
        // categoryName?: string;

        status: transaction.status
      });
    });

    return appTransactions;
  }

  const getAccountsMap = async (lmClient: InternalLunchMoneyClient) => {
    const accounts = await lmClient.getClient().getAssets();
    const accountsMap = new Map<number, AppAccount>();

    for (const account of accounts) {
      accountsMap.set(account.id, {
        accountName: account.name,
        institutionName: account.institution_name || "unknown",
        type: account.type_name,
        state: "open",
        balance: account.balance,
        currency: account.currency
      });
    }

    return accountsMap;
  }

  const initializeState = async () => {
    const lmValue = await getValueFor(LocalStorageKeys.LUNCH_MONEY_KEY);

    const lunchMoneyClient = new InternalLunchMoneyClient({ token: lmValue });
    const accounts = await getAccountsMap(lunchMoneyClient);
    // We have the API key so lets fetch everything we can and process it
    // We have to fetch accounts and categories first
    const transactions = await getTransactionsForApp(lunchMoneyClient, accounts);
    setAppState({ lmApiKey: lmValue, transactions: transactions });
    setIsReady(true);
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
          <Tab.Navigator
            initialRouteName="Transactions">
            <Tab.Screen
              name="Transactions"
              component={Transactions}
            />
            <Tab.Screen
              name="Charts"
              component={Charts}
            />
          </Tab.Navigator>
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