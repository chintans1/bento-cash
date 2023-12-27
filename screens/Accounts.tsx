import { useContext, useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { commonStyles } from "../styles/commonStyles";
import { ParentContext } from "../data/context";
import { AccountComponent } from "../components/Account";


export default function Accounts() {
  // const [transactions, setTransactions] = useState([]);
  const { accounts } = useContext(ParentContext);

  const netWorth = accounts
    .map(account => parseFloat(account.balance))
    .reduce((partialNw, balance) => partialNw + balance, 0)
    .toFixed(2);

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