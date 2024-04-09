import { View, Text, StyleSheet } from "react-native";
import { commonStyles } from "../../styles/commonStyles";
import { brandingColours } from "../../styles/brandingConstants";
import { AppAccount, AppCategory, AppDraftTransaction } from "../../models/lunchmoney/appModels";
import { useState } from "react";
import { Dropdown } from 'react-native-element-dropdown';
import Checkbox from "expo-checkbox";

// TODO: allow importing a transaction without category chosen

type ImportTransactionProps = {
  transaction: AppDraftTransaction;
  lmAccount?: AppAccount;
  availableCategories?: {"label": string, "value": AppCategory}[];
  updateTransaction: (transaction: AppDraftTransaction) => void;
}

const transactionStyles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",

    backgroundColor: brandingColours.shadedColour,
    borderRadius: 5,

    marginVertical: 3,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  dropdown: {
    height: 25,
    backgroundColor: brandingColours.backgroundColour,
    borderRadius: 10,
    paddingHorizontal: 8,
    color: brandingColours.darkTextColour
  },
  dropdownText: {
    color: brandingColours.darkTextColour,
    fontSize: 10,
  },
  leftSection: {
    flex: 4,
    flexDirection: "column"
  },
  rightSection: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-end",
  },
  transactionName: {
    flexWrap: "wrap",
    flexShrink: 1,
    color: brandingColours.darkTextColour,
    fontSize: 16,
    fontWeight: "bold"
  },
  smallText: {
    ...commonStyles.textBase,
    color: "grey",
    fontSize: 12
  },
  date: {
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
  },
  checkbox: {
    alignItems: "flex-end",
    flexDirection: "column",
  },
});

export function ImportTransactionComponent({ transaction, availableCategories, updateTransaction }: ImportTransactionProps) {
  const [checkboxClicked, setCheckboxClicked] = useState<boolean>(false);
  const [inputDisabled, setInputDisabled] = useState<boolean>(false);

  const [selectedCategory, setSelectedCategory] = useState<AppCategory>(null);

  const parsedAmount: number = parseFloat(transaction.amount);
  const isCreditTransaction = parsedAmount >= 0;
  const transactionAmountString = isCreditTransaction ?
    `$${parsedAmount.toFixed(2)}` : `-$${Math.abs(parsedAmount).toFixed(2)}`;

  const handleCategorySelection = (category: AppCategory) => {
    setSelectedCategory(category);
    // updateTransaction({
    //   ...transaction,
    //   categoryId: category.id,
    //   categoryName: category.name,
    //   importable: checkboxClicked
    // });
  }

  const handleCheckboxClick = (checked: boolean) => {
    setCheckboxClicked(checked);
    setInputDisabled(checked);
    updateTransaction({
      ...transaction,
      categoryId: selectedCategory?.id,
      categoryName: selectedCategory?.name,
      importable: checked
    });
  }

  return (
    <View style={transactionStyles.card}>
      <View style={transactionStyles.leftSection}>
        <View style={{ flexDirection: "row", alignItems: "baseline", justifyContent: "flex-start" }}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={transactionStyles.transactionName}>
            {transaction.payee}
          </Text>
          <Text style={[
            transactionStyles.amount,
            isCreditTransaction ? transactionStyles.amountPositive : transactionStyles.amountNegative
          ]}>  {transactionAmountString}</Text>
          <Text style={transactionStyles.date}>  {transaction.date}</Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={[transactionStyles.smallText, { flex: 1 }]}>{transaction.notes ?? "no memo provided"}</Text>
        </View>

        <Dropdown
          disable={inputDisabled || availableCategories.length === 0}
          style={transactionStyles.dropdown}
          placeholder={availableCategories.length === 0 ? "no category to choose" : "choose category..."}
          itemTextStyle={transactionStyles.dropdownText}
          placeholderStyle={transactionStyles.dropdownText}
          selectedTextStyle={transactionStyles.dropdownText}
          data={availableCategories}
          labelField={"label"}
          valueField={"value"}
          onChange={(valueSelected) => handleCategorySelection(valueSelected.value)} />
      </View>

      <View style={transactionStyles.rightSection}>
        <View style={transactionStyles.checkbox}>
        <Checkbox
          color={brandingColours.secondaryColour}
          style= {{ borderRadius: 15, backgroundColor: brandingColours.secondaryColour }}
          value={checkboxClicked}
          onValueChange={handleCheckboxClick} />
        </View>
      </View>
    </View>
  );
}