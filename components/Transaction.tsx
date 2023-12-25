import { View, Text, StyleSheet } from "react-native";
import { commonStyles } from "../styles/commonStyles";
import { brandingColours } from "../styles/brandingConstants";
import { AppTransaction } from "../models/lunchmoney/appModels";

type TransactionProps = {
  transaction: AppTransaction
}

const transactionStyles = StyleSheet.create({
  card: {
    // alignItems: 'center',
    backgroundColor: brandingColours.shadedColour,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 3,
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    // ...styles.cardShadow
  },
  leftSection: {
    flex: 1,
    flexDirection: "column"
  },
  rightSection: {
    alignItems: "flex-end",
    flexDirection: "column",
  },
  transactionName: {
    color: brandingColours.primaryColour,
    fontWeight: "bold",
  },
  date: {...commonStyles.textBase},
  account: {...commonStyles.textBase},
  amount: {
    color: brandingColours.secondaryColour,
    fontWeight: "bold"
   }
});

export function TransactionComponent({ transaction }: TransactionProps) {
  return (
    <View style={transactionStyles.card}>
      <View style={transactionStyles.leftSection}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={transactionStyles.transactionName}>{transaction.notes}</Text>
        <Text style={transactionStyles.account}>{transaction.assetName}</Text>
      </View>
      <View style={transactionStyles.rightSection}>
        <Text style={transactionStyles.amount}>{parseFloat(transaction.amount).toFixed(2)}</Text>
        <Text style={transactionStyles.date}>{transaction.date}</Text>
      </View>
    </View>
  );
}