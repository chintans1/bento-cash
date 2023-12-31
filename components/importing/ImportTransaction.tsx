import { View, Text, StyleSheet } from "react-native";
import { commonStyles } from "../../styles/commonStyles";
import { brandingColours } from "../../styles/brandingConstants";
import { AppCategory, AppDraftTransaction } from "../../models/lunchmoney/appModels";

type ImportTransactionProps = {
  transaction: AppDraftTransaction,
  categories?: AppCategory[]
}

// borderStyle: "dotted", borderColor: "#000000", borderWidth: 1

const transactionStyles = StyleSheet.create({
  card: {
    ...commonStyles.card
  },
  leftSection: {
    flex: 1,
    flexDirection: "column"
  },
  rightSection: {
    flex: 1,
    alignItems: "flex-end",
    flexDirection: "column"
  },
  transactionName: {
    flexWrap: "wrap",
    flexShrink: 1,
    color: brandingColours.primaryColour,
    fontSize: 16,
    fontWeight: "bold"
  },
  date: {
    ...commonStyles.textBase,
    color: "grey",
    fontSize: 10
  },
  account: {
    ...commonStyles.textBase,
    color: "grey",
    fontSize: 10
  },
  amount: {
    color: brandingColours.secondaryColour,
    fontWeight: "bold"
  },
  amountNegative: {
    color: brandingColours.red
  },
  amountPositive: {
    color: brandingColours.green
  }
});

export function ImportTransactionComponent({ transaction }: ImportTransactionProps) {
  const parsedAmount: number = parseFloat(transaction.amount);
  return (
    <View style={transactionStyles.card}>
      <View style={transactionStyles.leftSection}>
      <View style={{ flexDirection: "row" }}>
          <Text style={{ fontWeight: "bold" }}>Transaction name: </Text>
          <Text>{transaction.payee}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontWeight: "bold" }}>Transaction notes: </Text>
          <Text>{transaction.notes}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontWeight: "bold" }}>Account: </Text>
          <Text style={transactionStyles.account}>{transaction.externalAccountName}</Text>
        </View>
      </View>

      <View style={transactionStyles.rightSection}>
        <Text
          style={[
            transactionStyles.amount,
            parsedAmount > 0 ? transactionStyles.amountPositive : transactionStyles.amountNegative
          ]}>
          {parsedAmount.toFixed(2)}
        </Text>
        <Text style={transactionStyles.date}>{transaction.date}</Text>
      </View>
    </View>
  );
}