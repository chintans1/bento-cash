import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Button, FlatList, StyleSheet, Text, View } from "react-native";
import { SimpleFinImportData, getImportData } from "../../data/transformSimpleFin";
import { getAccountsData } from "../../clients/simplefinClient";
import { getSimpleFinAuth } from "../../utils/simpleFinAuth";
import { StorageKeys } from "../../models/enums/storageKeys";
import { brandingColours } from "../../styles/brandingConstants";
import { commonStyles } from "../../styles/commonStyles";
import { ImportAccountComponent } from "../../components/importing/ImportAccount";
import { AppDraftAccount } from "../../models/lunchmoney/appModels";
import { useParentContext } from "../../context/app/appContextProvider";
import InternalLunchMoneyClient from "../../clients/lunchMoneyClient";
import { getData, storeData } from "../../utils/asyncStorage";

export default function ImportAccountsScreen({ navigation }) {
  const { lmApiKey, accounts: lmAccounts } = useParentContext().appState;
  const lunchMoneyClient = new InternalLunchMoneyClient({ token: lmApiKey });

  const [importData, setImportData] = useState<SimpleFinImportData>(null);
  const [importableAccounts, setImportableAccounts] = useState<Map<string, AppDraftAccount>>(new Map());

  const [isReady, setIsReady] = useState<boolean>(false);
  const [creatingAccounts, setCreatingAccounts] = useState<boolean>(false);

  const getAccountMappings = async (): Promise<Map<string, string>> => {
    const existingAccountMappings = await getData(StorageKeys.ACCOUNT_MAPPING_KEY);
    return existingAccountMappings != null && JSON.stringify(existingAccountMappings) != "{}"
      ? new Map(existingAccountMappings) : new Map<string, string>();
  }

  const fetchDataFromSimpleFin = async () => {
    if (!isReady) {
      const fetchedAccountsResponse = await getAccountsData(await getSimpleFinAuth());
      const fetchedAccountMappings = await getAccountMappings();

      setImportData(getImportData(fetchedAccountMappings, lmAccounts, fetchedAccountsResponse));
    }

    setIsReady(true);
  }

  const handleAccountChange = (newAccount: AppDraftAccount) => {
    importData.accountsToImport.set(newAccount.externalAccountId, newAccount);

    if (newAccount.importable) {
      importableAccounts.set(newAccount.externalAccountId, newAccount);
    } else {
      importableAccounts.delete(newAccount.externalAccountId);
    }
  }

  const handleAccountCreation = async () => {
    setCreatingAccounts(true);
    const existingAccountMappings = await getAccountMappings();
    for (const [id, accountToCreate] of importableAccounts) {
      const accountCreated = await lunchMoneyClient.createAccount(accountToCreate);
      existingAccountMappings.set(id, accountCreated.id.toString());
    }
    await storeData(StorageKeys.ACCOUNT_MAPPING_KEY, Array.from(existingAccountMappings.entries()));
    Alert.alert("Accounts created!", "Moving to importing transactions now",
      [{text: "Ok", onPress: () => moveToTransactions()}]);
  }

  const handleNextButtonClick = () => {
    // TODO: need to make sure we disable the button when creating accounts
    // TODO: need to allow choosing existing LM accounts to map
    if (importableAccounts.size == 0) {
      Alert.alert("No accounts selected",
        "Are you sure you do not want to import any accounts?",
        [{text: "Ok", onPress: () => moveToTransactions()}]);
      return;
    }

    Alert.alert("Create these accounts",
    `Do you want to create the following accounts?\n
    ${Array.from(importableAccounts.values()).map(v => v.accountName).join("\n")}`,
    [
      {text: "Cancel", style: "cancel"},
      {text: "Create", onPress: () => handleAccountCreation()}
    ]
    )
  }

  const moveToTransactions = () => {
    navigation.navigate("ImportTransactions", {
      transactionsToImport: importData.transactionsToImport,
      lunchMoneyClient: lunchMoneyClient
    });
  }

  useEffect(() => {
    fetchDataFromSimpleFin();
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Next"
          color={brandingColours.primaryColour}
          onPress={() => handleNextButtonClick()}
          disabled={creatingAccounts}
        />
      ),
    });
  }, [navigation, importData]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color={brandingColours.primaryColour} />
      </View>
    )
  }

  if (creatingAccounts) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color={brandingColours.primaryColour} />
        <Text style={{ textAlign: "center" }}>Creating accounts...</Text>
      </View>
    )
  }


  // User will update the accounts presented, once ready they can checkmark it
  // All checkmarked accounts can be created now when user selects "Create/Next"
  // We show alert to confirm and create accounts, then we show transactions

  return (
    <View style={[commonStyles.container]}>
      <Text style={commonStyles.headerText}>Accounts to import: {importData.accountsToImport.size}</Text>
      <FlatList
        data={Array.from(importData.accountsToImport.values())}
        renderItem={({ item }) => <ImportAccountComponent account={item} setUpdatedAccount={handleAccountChange} />}
      />
    </View>
  )
}