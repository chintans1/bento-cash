import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { getValueFor } from './utils/secureStore';
import { StorageKeys } from './models/enums/storageKeys';
import Initialization from './screens/Initialization';
import Transactions from './screens/Transactions';
import Charts from './screens/Charts';
import { NavigationContainer } from '@react-navigation/native';
import { AppState, ParentContext } from './context/app/appContextProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import InternalLunchMoneyClient from './clients/lunchMoneyClient';
import { AppAccount, AppCategory, AppTransaction } from './models/lunchmoney/appModels';
import { brandingColours } from './styles/brandingConstants';
import Accounts from './screens/Accounts';
import Settings from './screens/Settings';
import { AppProvider } from './context/app/AppProvider';
import { getAccountsMap, getCategoriesMap, getTransactionsForApp } from './data/transformLunchMoney';


const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <AppProvider>
      <SafeAreaProvider>
        <StatusBar
          animated={true}
          style="auto"
        />
        <NavigationContainer>
          <Tab.Navigator
            initialRouteName="Transactions"
            screenOptions={{
              headerTitleAlign: "left",
              headerShadowVisible: false,
              headerStyle: {
                backgroundColor: brandingColours.backgroundColour,
                borderColor: brandingColours.backgroundColour
              },
              headerTitleStyle: {
                fontSize: 28,
                fontWeight: "bold",
                color: brandingColours.secondaryColour
              }
            }}>
            <Tab.Screen
              name="Transactions"
              component={Transactions}
            />
            <Tab.Screen
              name="Accounts"
              component={Accounts}
            />
            <Tab.Screen
              name="Charts"
              component={Charts}
            />
            <Tab.Screen
              name="Settings"
              component={Settings}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </AppProvider>
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