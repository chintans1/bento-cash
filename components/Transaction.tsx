import { View, Text, StyleSheet } from "react-native";
import { commonStyles } from "../styles/commonStyles";
import { brandingColours } from "../styles/brandingConstants";
import { AppTransaction } from "../models/lunchmoney/appModels";
import { CategoryComponent } from "./Category";

type TransactionProps = {
  transaction: AppTransaction
}

// borderStyle: "dotted", borderColor: "#000000", borderWidth: 1

const transactionStyles = StyleSheet.create({
  card: {
    ...commonStyles.card
  },
  leftSection: {
    flex: 3.5,
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

export function TransactionComponent({ transaction }: TransactionProps) {
  const transactionAmount = parseFloat(transaction.amount);
  const isCreditTransaction = transactionAmount >= 0;
  const transactionAmountString = isCreditTransaction ?
    `$${transactionAmount.toFixed(2)}` : `-$${Math.abs(transactionAmount).toFixed(2)}`;

  return (
    <View style={transactionStyles.card}>
      <View style={transactionStyles.leftSection}>
        <View style={{ flexDirection: "row" }}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={transactionStyles.transactionName}>{transaction.payee}</Text>
          {transaction.status === "pending" ? <CategoryComponent categoryName="pending" /> : null}
          <CategoryComponent categoryName={transaction.categoryName} />
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={transactionStyles.account}>{transaction.assetName ? transaction.assetName : "unknown account"}</Text>
        </View>
      </View>
      <View style={transactionStyles.rightSection}>
        <Text
          style={[transactionStyles.amount, isCreditTransaction ? transactionStyles.amountPositive : transactionStyles.amountNegative]}>
          {transactionAmountString}
        </Text>
        <Text style={transactionStyles.date}>{transaction.date}</Text>
      </View>
    </View>
  );
}