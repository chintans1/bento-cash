import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Transactions from './screens/Transactions';
import Charts from './screens/Charts';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { brandingColours } from './styles/brandingConstants';
import Accounts from './screens/Accounts';
import { AppProvider } from './context/app/AppProvider';
import SettingsStackScreen from './screens/SettingsStackScreen';
import { commonStyles } from './styles/commonStyles';

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
                color: brandingColours.header
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
              component={SettingsStackScreen}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </AppProvider>
  );
}
