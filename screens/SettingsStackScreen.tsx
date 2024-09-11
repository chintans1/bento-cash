import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Settings from './Settings';
import SimpleFinImportStackScreen from './ImportStackScreen';

const SettingsStack = createNativeStackNavigator();

export default function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <SettingsStack.Screen
        name="SettingsScreen"
        options={{
          title: 'Settings',
        }}
        component={Settings}
      />
      <SettingsStack.Screen
        name="SimpleFinImport"
        options={{
          title: 'Importing data from SimpleFIN',
          headerShown: false,
          presentation: 'transparentModal',
        }}
        component={SimpleFinImportStackScreen}
      />
    </SettingsStack.Navigator>
  );
}
