import { View, Text, StyleSheet, TextInput } from "react-native";
import { commonStyles } from "../../styles/commonStyles";
import { brandingColours } from "../../styles/brandingConstants";
import { AppDraftAccount, AccountType, accountTypes, ImportAccount } from "../../models/lunchmoney/appModels";
import Checkbox from "expo-checkbox";
import { useState } from "react";
import { Dropdown } from 'react-native-element-dropdown';

type ImportAccountProps = {
  account: ImportAccount,
  existingLmAccounts?: {"label": string, "value": number}[],
  setUpdatedAccount: (account: ImportAccount) => void
}

const data: {"label": string, "value": string}[] =
  accountTypes.map(accountType => {
    return {"label": accountType, "value": accountType}
  });

const accountStyles = StyleSheet.create({
  card: {
    ...commonStyles.card,
    flexDirection: "row",
    alignItems: "center",
  },
  leftSection: {
    flex: 1,
    flexDirection: "column",
    marginRight: 5,
  },
  dropdownView: {
    ...commonStyles.rowView,
    justifyContent: "space-between",
    marginTop: 10
  },
  textInput: {
    flex: 1,
    backgroundColor: brandingColours.shadedColour,
    color: brandingColours.darkTextColour,
    fontSize: 10,

    borderColor: brandingColours.secondaryColour,
    borderWidth: 1,
    borderRadius: 10,

    marginStart: 5,
    padding: 5,
    height: 25,
  },
  checkboxView: {
    alignItems: "flex-end",
    flexDirection: "column",
  },
  checkbox: {
    borderRadius: 15,
    backgroundColor: brandingColours.primaryColour
  },
  smallText: {
    ...commonStyles.textBase,
    color: brandingColours.darkTextColour,
    fontSize: 12,
  },
  dropdown: {
    height: 25,
    width: 150,
    backgroundColor: brandingColours.backgroundColour,
    borderRadius: 10,
    paddingHorizontal: 8,
  },
  dropdownText: {
    color: brandingColours.darkTextColour,
    fontSize: 10,
  },
  amount: {
    fontSize: 12,
    fontWeight: "bold"
  },
  amountNegative: {
    color: brandingColours.red
  },
  amountPositive: {
    color: brandingColours.green
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  dividerText: {
    fontWeight: "bold",
    color: brandingColours.grey,
    fontSize: 10,
    marginHorizontal: 5
  },
  divider: {
    flex: 1,
    backgroundColor: brandingColours.dividerColour,
    height: StyleSheet.hairlineWidth,
  }
});

export function ImportAccountComponent({ account, existingLmAccounts, setUpdatedAccount }: ImportAccountProps) {
  const [checkboxClicked, setCheckboxClicked] = useState<boolean>(false);
  const [checkboxEnabled, setCheckboxEnabled] = useState<boolean>(false);
  const [inputDisabled, setInputDisabled] = useState<boolean>(false);

  const [selectedAccountType, setSelectedAccountType] = useState<string>("");
  const [selectedSyncAccount, setSelectedSyncAccount] = useState<number>(null);
  const [accountName, setAccountName] = useState<string>(account.accountName);
  const [institutionName, setInstitutionName] = useState<string>(account.institutionName);

  const handleAccountTypeSelect = (accountTypeSelected: AccountType) => {
    setSelectedAccountType(accountTypeSelected);

    if (accountTypeSelected.length > 0
        && accountName.trim().length > 0
        && institutionName.trim().length > 0) {
      setCheckboxEnabled(true);
      return;
    }
    setCheckboxEnabled(false);
  }

  const handleExistingAccountSelect = (selectedAccountId: number) => {
    setSelectedSyncAccount(selectedAccountId);

    if (selectedAccountId > 0) {
      setCheckboxEnabled(true);
      return;
    }
    setCheckboxEnabled(false);
  }

  const handleAccountNameChange = (accountName: string) => {
    setAccountName(accountName);
  }

  const handleInstitutionNameChange = (institutionName: string) => {
    setInstitutionName(institutionName);
  }

  const renderExistingAccountPicker = () => {
    if (existingLmAccounts?.length > 0) {
      return (
        <View>
          <View style={accountStyles.dividerContainer}>
            <View style={accountStyles.divider} />
            <Text style={accountStyles.dividerText}>OR</Text>
            <View style={accountStyles.divider} />
          </View>
          <View style={accountStyles.dropdownView}>
            <Dropdown
              disable={inputDisabled || selectedAccountType.length > 0}
              style={[accountStyles.dropdown, { flex: 1 }]}
              placeholder="choose from existing account..."
              itemTextStyle={accountStyles.dropdownText}
              placeholderStyle={accountStyles.dropdownText}
              selectedTextStyle={accountStyles.dropdownText}
              data={existingLmAccounts}
              labelField={"label"}
              valueField={"value"}
              onChange={(valueSelected) => handleExistingAccountSelect(valueSelected.value)} />
          </View>
      </View>
      );
    }

    return null;
  }

  // User will update the accounts presented, once ready they can checkmark it
  // All checkmarked accounts can be created now when user selects "Create/Next"
  // We show alert to confirm and create accounts, then we show transactions

  // Information we need to create account:
  // "name": lmAccount.accountName,
  // "type_name": lmAccount.type,
  // "balance": lmAccount.balance,
  // "currency": lmAccount.currency.toLowerCase(),
  // "institution_name": lmAccount.institutionName

  const accountBalance = parseFloat(account.balance);
  const balanceString = accountBalance >= 0 ?
    `$${accountBalance.toFixed(2)}` : `-$${Math.abs(accountBalance).toFixed(2)}`;

  return (
    <View style={accountStyles.card}>
      <View style={accountStyles.leftSection}>
        <View style={commonStyles.rowView}>
          <Text style={accountStyles.smallText}>account name: </Text>
          <TextInput
            editable={!inputDisabled}
            defaultValue={account.accountName}
            value={accountName}
            style={accountStyles.textInput}
            autoComplete="off"
            autoCorrect={false}
            onChangeText={(newValue) => handleAccountNameChange(newValue)} />
        </View>
        <View style={{...commonStyles.rowView, marginTop: 10 }}>
          <Text style={accountStyles.smallText}>institution:</Text>
          <TextInput
            editable={!inputDisabled}
            defaultValue={account.institutionName}
            value={institutionName}
            style={accountStyles.textInput}
            autoComplete="off"
            autoCorrect={false}
            onChangeText={(newValue) => handleInstitutionNameChange(newValue)} />
        </View>
        <View style={accountStyles.dropdownView}>
          <Dropdown
            disable={inputDisabled || selectedSyncAccount > 0}
            style={accountStyles.dropdown}
            placeholder="choose account type..."
            itemTextStyle={accountStyles.dropdownText}
            placeholderStyle={accountStyles.dropdownText}
            selectedTextStyle={accountStyles.dropdownText}
            data={data}
            labelField={"label"}
            valueField={"value"}
            onChange={(valueSelected) => handleAccountTypeSelect(valueSelected.value)} />

          <Text style={accountStyles.smallText}>currency: <Text style={accountStyles.amount}>{ account.currency }</Text></Text>
          <Text
            adjustsFontSizeToFit={true}
            numberOfLines={1}
            style={[accountStyles.amount, accountBalance >= 0 ? accountStyles.amountPositive : accountStyles.amountNegative ]}>
              { balanceString }
          </Text>
        </View>
        {renderExistingAccountPicker()}
      </View>

      <View style={accountStyles.checkboxView}>
        <Checkbox
          color={brandingColours.secondaryColour}
          style={accountStyles.checkbox}
          disabled={!checkboxEnabled}
          value={checkboxClicked}
          onValueChange={(checked) => {
            setCheckboxClicked(checked);
            setInputDisabled(checked);
            setUpdatedAccount({
              ...account,
              type: selectedAccountType,
              accountName: accountName,
              institutionName: institutionName,
              lmAccountId: selectedSyncAccount,
              importable: checked
            });
          }} />
      </View>
    </View>
  );
}