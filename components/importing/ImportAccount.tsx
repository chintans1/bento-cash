import { View, Text, StyleSheet, TextInput } from "react-native";
import { commonStyles } from "../../styles/commonStyles";
import { brandingColours } from "../../styles/brandingConstants";
import { AppDraftAccount, AccountType, accountTypes } from "../../models/lunchmoney/appModels";
import Checkbox from "expo-checkbox";
import { useState } from "react";
import { Dropdown } from 'react-native-element-dropdown';

type ImportAccountProps = {
  account: AppDraftAccount,
  existingLmAccounts?: {"label": string, "value": number}[],
  setUpdatedAccount: (account: AppDraftAccount) => void
}

const data: {"label": string, "value": string}[] =
  accountTypes.map(accountType => {
    return {"label": accountType, "value": accountType}
  });

const accountStyles = StyleSheet.create({
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
  leftSection: {
    flex: 1,
    flexDirection: "column",
    marginRight: 5,
  },
  textInput: {
    flex: 1,
    backgroundColor: brandingColours.shadedColour,
    color: brandingColours.secondaryColour,
    fontSize: 10,

    borderColor: brandingColours.secondaryColour,
    borderWidth: 1,
    borderRadius: 10,

    marginStart: 5,
    padding: 5,
  },
  checkbox: {
    alignItems: "flex-end",
    flexDirection: "column",
  },
  smallText: {
    ...commonStyles.textBase,
    color: brandingColours.grey,
    fontSize: 12,
    fontWeight: "bold"
  },
  dropdown: {
    height: 15,
    width: 150,
    backgroundColor: '#EEEEEE',
    borderRadius: 20,
    paddingHorizontal: 5
  },
  amount: {
    color: brandingColours.secondaryColour,
    fontSize: 12,
    fontWeight: "bold"
  },
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

    if (accountTypeSelected.length > 0 && accountName.length > 0 && institutionName.length > 0) {
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
    if (accountName.length <= 0) {
      accountName = account.accountName;
    }
    setAccountName(accountName);
  }

  const handleInstitutionNameChange = (institutionName: string) => {
    if (institutionName.length <= 0) {
      institutionName = account.institutionName;
    }
    setInstitutionName(institutionName);
  }

  const renderExistingAccountPicker = () => {
    if (existingLmAccounts?.length > 0) {
      return (
        <View>
          <View style={{
            borderBottomColor: brandingColours.secondaryColour,
            borderBottomWidth: StyleSheet.hairlineWidth,
            marginTop: 10
          }} />
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
            <Dropdown
              disable={inputDisabled || selectedAccountType.length > 0}
              style={[accountStyles.dropdown, { flex: 1 }]}
              placeholder="choose from existing account..."
              itemTextStyle={{ fontSize: 10 }}
              placeholderStyle={{ fontSize: 10 }}
              selectedTextStyle={{ fontSize: 10 }}
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

  return (
    <View style={accountStyles.card}>
      <View style={accountStyles.leftSection}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
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
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
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
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
          <Dropdown
            disable={inputDisabled || selectedSyncAccount > 0}
            style={accountStyles.dropdown}
            placeholder="choose account type..."
            itemTextStyle={{ fontSize: 10 }}
            placeholderStyle={{ fontSize: 10 }}
            selectedTextStyle={{ fontSize: 10 }}
            data={data}
            labelField={"label"}
            valueField={"value"}
            onChange={(valueSelected) => handleAccountTypeSelect(valueSelected.value)} />

          <Text style={accountStyles.smallText}>currency: <Text style={accountStyles.amount}>{ account.currency }</Text></Text>
          <Text adjustsFontSizeToFit={true} numberOfLines={1} style={accountStyles.amount}>${ parseFloat(account.balance).toFixed(2) }</Text>
        </View>
        {renderExistingAccountPicker()}
      </View>

      <View style={accountStyles.checkbox}>
        <Checkbox
          color={brandingColours.primaryColour}
          style= {{ borderRadius: 15, backgroundColor: brandingColours.primaryColour }}
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