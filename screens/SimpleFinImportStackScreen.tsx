import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ImportAccountsScreen from "./importing/ImportAccounts";
import ImportTransactionsScreen from "./importing/ImportTransactions";

const SimpleFinImportStack = createNativeStackNavigator();

export default function SimpleFinImportStackScreen() {

  return (
    <SimpleFinImportStack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackVisible: false,
        gestureEnabled: false,
      }}>
      <SimpleFinImportStack.Screen
        name="ImportAccounts"
        options={{
          title:"Importing accounts",
          presentation: "modal",
        }} component={ImportAccountsScreen} />
      <SimpleFinImportStack.Screen
        name="ImportTransactions"
        options={{
          title: "Importing transactions",
         }} component={ImportTransactionsScreen} />
    </SimpleFinImportStack.Navigator>
  );
}