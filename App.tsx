import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Toast from 'react-native-toast-message';
import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';
import Transactions from './screens/Transactions';
import Charts from './screens/Charts';
import { NewBrandingColours } from './styles/brandingConstants';
import Accounts from './screens/Accounts';
import SettingsStackScreen from './screens/SettingsStackScreen';
import TabBarIcon, { getTabRoute } from './components/icons/TabBarIcon';
import AppProvider from './context/app/AppProvider';

import ErrorBoundary from './context/app/ErrorBoundary';
import Dashboard from './screens/Dashboard';

const Tab = createBottomTabNavigator();

const renderTabIcon = (routeName: string, color: string, size: number) => {
  return (
    <TabBarIcon routeName={getTabRoute(routeName)} color={color} size={size} />
  );
};

Sentry.init({
  dsn: Constants.expoConfig?.extra?.SENTRY_DSN,
  debug: __DEV__,
});

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <SafeAreaProvider>
          <StatusBar animated />
          <NavigationContainer>
            <Tab.Navigator
              initialRouteName="Dashboard"
              screenOptions={({ route }) => ({
                headerTitleAlign: 'left',
                headerShadowVisible: false,
                headerStyle: {
                  backgroundColor: NewBrandingColours.neutral.background,
                  borderColor: NewBrandingColours.neutral.background,
                },
                headerTitleStyle: {
                  fontSize: 28,
                  fontWeight: 'bold',
                  color: NewBrandingColours.text.primary,
                },
                tabBarActiveTintColor: NewBrandingColours.primary.main,
                tabBarIcon: ({ color, size }) =>
                  renderTabIcon(route.name, color, size),
              })}
            >
              <Tab.Screen name="Dashboard" component={Dashboard} />
              <Tab.Screen name="Transactions" component={Transactions} />
              <Tab.Screen name="Accounts" component={Accounts} />
              <Tab.Screen name="Charts" component={Charts} />
              <Tab.Screen
                name="Settings"
                component={SettingsStackScreen}
                options={{
                  headerShown: false,
                }}
              />
            </Tab.Navigator>
          </NavigationContainer>
          <Toast />
        </SafeAreaProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default Sentry.wrap(App);
