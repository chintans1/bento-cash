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

// borderStyle: "dotted", borderColor: "#000000", borderWidth: 1

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
    height: 20,
    // width: 150,
    backgroundColor: '#EEEEEE',
    borderRadius: 20,
    paddingHorizontal: 5
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
    color: brandingColours.primaryColour,
    fontSize: 16,
    fontWeight: "bold"
  },
  smallText: {
    ...commonStyles.textBase,
    color: brandingColours.grey,
    fontSize: 12,
    fontWeight: "bold"
  },
  date: {
    ...commonStyles.textBase,
    color: brandingColours.grey,
    fontSize: 10
  },
  account: {
    ...commonStyles.textBase,
    color: brandingColours.grey,
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
            parsedAmount > 0 ? transactionStyles.amountPositive : transactionStyles.amountNegative
          ]}>  ${parsedAmount.toFixed(2)}</Text>
          <Text style={transactionStyles.date}>  {transaction.date}</Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={[transactionStyles.smallText, { flex: 1 }]}>{transaction.notes}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={transactionStyles.account}>{transaction.externalAccountName}</Text>
        </View>

        <Dropdown
          disable={inputDisabled || availableCategories.length === 0}
          style={transactionStyles.dropdown}
          placeholder={availableCategories.length === 0 ? "no category to choose" : "choose category..."}
          itemTextStyle={{ fontSize: 10 }}
          placeholderStyle={{ fontSize: 10 }}
          selectedTextStyle={{ fontSize: 10 }}
          data={availableCategories}
          labelField={"label"}
          valueField={"value"}
          onChange={(valueSelected) => handleCategorySelection(valueSelected.value)} />
      </View>

      <View style={transactionStyles.rightSection}>
        <View style={transactionStyles.checkbox}>
        <Checkbox
          color={brandingColours.primaryColour}
          style= {{ borderRadius: 15, backgroundColor: brandingColours.primaryColour }}
          value={checkboxClicked}
          onValueChange={handleCheckboxClick} />
        </View>
      </View>
    </View>
  );
}