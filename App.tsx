import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Toast from 'react-native-toast-message';
import Transactions from './screens/Transactions';
import Charts from './screens/Charts';
import BrandingColours from './styles/brandingConstants';
import Accounts from './screens/Accounts';
import SettingsStackScreen from './screens/SettingsStackScreen';
import TabBarIcon, { getTabRoute } from './components/icons/TabBarIcon';
import AppProvider from './context/app/AppProvider';

// https://github.com/expo/expo/issues/28618#issuecomment-2099225578
import 'react-native-reanimated';
import ErrorBoundary from './context/app/ErrorBoundary';

const Tab = createBottomTabNavigator();

const renderTabIcon = (routeName: string, color: string, size: number) => {
  return (
    <TabBarIcon routeName={getTabRoute(routeName)} color={color} size={size} />
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <SafeAreaProvider>
          <StatusBar animated />
          <Toast />
          <NavigationContainer>
            <Tab.Navigator
              initialRouteName="Transactions"
              screenOptions={({ route }) => ({
                headerTitleAlign: 'left',
                headerShadowVisible: false,
                headerStyle: {
                  backgroundColor: BrandingColours.backgroundColour,
                  borderColor: BrandingColours.backgroundColour,
                },
                headerTitleStyle: {
                  fontSize: 28,
                  fontWeight: 'bold',
                  color: BrandingColours.header,
                },
                tabBarActiveTintColor: BrandingColours.secondaryColour,
                tabBarIcon: ({ color, size }) =>
                  renderTabIcon(route.name, color, size),
              })}
            >
              <Tab.Screen name="Transactions" component={Transactions} />
              <Tab.Screen name="Accounts" component={Accounts} />
              <Tab.Screen name="Charts" component={Charts} />
              <Tab.Screen name="Settings" component={SettingsStackScreen} />
            </Tab.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}
