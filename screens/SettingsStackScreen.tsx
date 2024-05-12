import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Settings from './Settings';
import SimpleFinImportStackScreen from './SimpleFinImportStackScreen';

const SettingsStack = createNativeStackNavigator();

export default function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
        // headerStyle: { backgroundColor: 'tomato' },
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
        }}
        component={SimpleFinImportStackScreen}
      />
    </SettingsStack.Navigator>
  );
}
