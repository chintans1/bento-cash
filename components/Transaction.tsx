import { Transaction } from "lunch-money";
import { View, Text, StyleSheet } from "react-native";
import { commonStyles } from "../styles/commonStyles";

type TransactionProps = {
  transaction: Transaction
}

const transactionStyles = StyleSheet.create({
  card: {
    // alignItems: 'center',
    backgroundColor: "#f0f0f0",
    borderRadius: 2,
    flex: 1,
    margin: 5,
    // ...styles.cardShadow
  },
  topBar: {
    flex: 1,
    textAlign: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    verticalAlign: "bottom"
  },
  transactionName: {
    ...commonStyles.headerText,
    fontWeight: "bold"
  },
  date: {...commonStyles.textBase},
  amount: {...commonStyles.textBase }
});

export function TransactionComponent({ transaction }: TransactionProps) {
  return (
    <View style={transactionStyles.card}>
      <View style={transactionStyles.topBar}>
        <Text style={transactionStyles.transactionName}>{transaction.payee}</Text>
        <Text style={transactionStyles.amount}>{parseFloat(transaction.amount).toFixed(2)}</Text>
      </View>
      <Text style={transactionStyles.date}>{transaction.date}</Text>
    </View>
  );
}