import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ImportAccountsScreen from "./importing/ImportAccounts";
import ImportTransactionsScreen from "./importing/ImportTransactions";
import { Button } from "react-native";
import { brandingColours } from "../styles/brandingConstants";

const SimpleFinImportStack = createNativeStackNavigator();

export default function SimpleFinImportStackScreen() {


  //     <Text style={commonStyles.headerText}>Transactions to import</Text>
  //     <FlatList
  //       data={importData.transactionsToImport}
  //       renderItem={({ item }) => <ImportTransactionComponent transaction={item} />}
  //     />
  //   </View>
  // )

  return (
    <SimpleFinImportStack.Navigator
      screenOptions={{
        headerShown: true,
        presentation: "modal",
        //headerStyle: { backgroundColor: 'tomato' },
      }}>
      <SimpleFinImportStack.Screen name="ImportAccounts"
        options={{
          title:"Importing accounts",
          headerRight: () => (
            <Button
              onPress={() => alert("Something went wrong, this should not happen.")}
              title="Next"
              color={brandingColours.primaryColour}
            />
          )
        }} component={ImportAccountsScreen} />
      <SimpleFinImportStack.Screen name="ImportTransactions"
        options={{
          title: "Importing transactions",
          // headerShown: true,
         }} component={ImportTransactionsScreen} />
    </SimpleFinImportStack.Navigator>
  );
}