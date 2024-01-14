import { FlatList, StyleSheet, Text, View } from "react-native";
import { commonStyles } from "../styles/commonStyles";
import { useParentContext } from "../context/app/appContextProvider";
import { AccountComponent } from "../components/Account";
import { brandingColours } from "../styles/brandingConstants";

export const separator = () => {
  return (
    <View style={{
      borderBottomColor: brandingColours.dividerColour,
      borderBottomWidth: StyleSheet.hairlineWidth,
      marginHorizontal: 10
    }} />
  );
}

const styles = StyleSheet.create({
  card: {
    ...commonStyles.card,
    flexDirection: "column",
    flex: 0,
    borderRadius: 8,
    marginBottom: 10,
  }
});

export default function Accounts() {
  const { accounts: accountsMap } = useParentContext().appState;
  const accounts = Array.from(accountsMap.values());

  const netWorth = accounts
    .map(account => parseFloat(account.balance))
    .reduce((partialNw, balance) => partialNw + balance, 0)
    .toFixed(2);

  // const mappedAccounts: Map<string, AppAccount[]> = new Map();

  return (
    <View style={commonStyles.container}>
      <View style={styles.card}>
        <Text style={{ color: brandingColours.primaryColour, fontSize: 20, fontWeight: "bold" }}>Overview</Text>
        <Text style={{ color: brandingColours.secondaryColour, fontSize: 16 }}>Net worth: ${netWorth}</Text>
      </View>

      <FlatList
        style={commonStyles.list}
        ItemSeparatorComponent={separator}
        data={accounts}
        renderItem={({ item }) => <AccountComponent account={item} />}
      />
    </View>
  )
}