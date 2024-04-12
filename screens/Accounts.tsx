import { SectionList, StyleSheet, Text, View } from "react-native";
import { commonStyles } from "../styles/commonStyles";
import { useParentContext } from "../context/app/appContextProvider";
import { AccountComponent } from "../components/Account";
import { brandingColours } from "../styles/brandingConstants";
import { AppAccount } from "../models/lunchmoney/appModels";
import { getGroupedAccountsByInstitution } from "../data/utils";


const separator = () => {
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
    marginVertical: 0,
    flexDirection: "column",
    flex: 0,
    borderRadius: 8,
    marginBottom: 10,
  },
  list: {
    ...commonStyles.list,
  },
  institutionName: {
    backgroundColor: brandingColours.secondaryColour,
    color: brandingColours.lightTextColour,
    fontWeight: "bold",
    fontSize: 12,
    padding: 10,
  }
});

export default function Accounts() {
  const { accounts: accountsMap } = useParentContext().appState;
  const accounts = Array.from(accountsMap.values());
  const accountsByInstitution = getGroupedAccountsByInstitution(accounts);
  const netWorth = accounts
    .map(account => parseFloat(account.balance))
    .reduce((partialNw, balance) => partialNw + balance, 0)
    .toFixed(2);

  return (
    <View style={[commonStyles.container, { flex: 1 }]}>
      <View style={styles.card}>
        <Text style={{ color: brandingColours.darkTextColour, fontSize: 20, fontWeight: "bold" }}>Overview</Text>
        <Text style={{ color: brandingColours.secondaryColour, fontSize: 16 }}>Net worth: ${netWorth}</Text>
      </View>

      <SectionList
        sections={accountsByInstitution}
        style={styles.list}
        ItemSeparatorComponent={separator}
        keyExtractor={(account, index) => account.id.toString()}
        renderSectionHeader={({ section: { title: institutionName } }) => (
          <Text style={styles.institutionName}>{institutionName}</Text>
        )}
        renderItem={({ item }) => <AccountComponent account={item} />}
      />
    </View>
  )
}