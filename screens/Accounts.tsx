import { FlatList, Text, View } from "react-native";
import { commonStyles } from "../styles/commonStyles";
import { useParentContext } from "../context/app/appContextProvider";
import { AccountComponent } from "../components/Account";
import { AppAccount } from "../models/lunchmoney/appModels";


export default function Accounts() {
  const { accounts } = useParentContext().appState;

  const netWorth = accounts
    .map(account => parseFloat(account.balance))
    .reduce((partialNw, balance) => partialNw + balance, 0)
    .toFixed(2);

  // const mappedAccounts: Map<string, AppAccount[]> = new Map();

  return (
    <View style={commonStyles.container}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Net worth: ${netWorth}</Text>
      <FlatList
        data={accounts}
        renderItem={({ item }) => <AccountComponent account={item} />}
      />
    </View>
  )
}