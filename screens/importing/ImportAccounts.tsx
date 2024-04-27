import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, KeyboardAvoidingView, Platform, SafeAreaView, SectionList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SimpleFinImportData, getImportData } from "../../data/transformSimpleFin";
import { getAccountsData } from "../../clients/simplefinClient";
import { getSimpleFinAuth } from "../../utils/simpleFinAuth";
import { StorageKeys } from "../../models/enums/storageKeys";
import { brandingColours } from "../../styles/brandingConstants";
import { commonStyles } from "../../styles/commonStyles";
import { ImportAccountComponent } from "../../components/importing/ImportAccount";
import { AppAccount, AppDraftAccount } from "../../models/lunchmoney/appModels";
import { useParentContext } from "../../context/app/appContextProvider";
import InternalLunchMoneyClient from "../../clients/lunchMoneyClient";
import { getData, storeData } from "../../utils/asyncStorage";
import { getGroupedAccountsForImport } from "../../data/utils";
import { AccountComponent } from "../../components/Account";

const styles = StyleSheet.create({
  card: {
    ...commonStyles.card,
    flex: 0,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 6
  },
  button: {
    backgroundColor: brandingColours.secondaryColour,
    marginTop: 10,
    //marginBottom: 25,
    height: 40,
    borderColor: "#8ECAE6",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: brandingColours.shadedColour,
    fontWeight: "bold",
    fontSize: 18
  }
});

// TODO: need to refresh lmAccounts after account creation
// TODO: need to refresh transactions after transaction creation
export default function ImportAccountsScreen({ navigation }) {
  const { lmApiKey, accounts: lmAccounts } = useParentContext().appState;
  const lunchMoneyClient = new InternalLunchMoneyClient({ token: lmApiKey });

  const [importData, setImportData] = useState<SimpleFinImportData>(null);
  const [importableAccounts] = useState<Map<string, AppDraftAccount>>(new Map());

  const [isReady, setIsReady] = useState<boolean>(false);
  const [creatingAccounts, setCreatingAccounts] = useState<boolean>(false);

  const [syncingAccounts, setSyncingAccounts] = useState<boolean>(false);
  const [noAccountsToImport, setNoAccountsToImport] = useState<boolean>(false);

  const [dropdownAccountsData, setDropdownAccountsData] = useState<{"label": string, "value": number}[]>(null);

  const [buttonText, setButtonText] = useState<string>("No accounts selected");

  const getAccountMappings = async (): Promise<Map<string, string>> => {
    const existingAccountMappings = await getData(StorageKeys.ACCOUNT_MAPPING_KEY);
    return existingAccountMappings != null && JSON.stringify(existingAccountMappings) != "{}"
      ? new Map(existingAccountMappings) : new Map<string, string>();
  }

  const handleButtonTextChange = () => {
    if (importableAccounts.size === 0) {
      setButtonText("No accounts to import");
    } else if (importableAccounts.size === 1) {
      setButtonText("Import 1 account");
    } else {
      setButtonText("Import " + importableAccounts.size + " accounts");
    }
  }

  // TODO: maybe this logic does not need to live here??
  const getLastImportDate = async (): Promise<Date> => {
    const lastImportDate = await getData(StorageKeys.LAST_DATE_OF_IMPORT);
    console.log(lastImportDate);
    return lastImportDate != null ? new Date(lastImportDate) : new Date();
  }

  const fetchDataFromSimpleFin = async () => {
    if (!isReady) {
      const lastImportDate = await getLastImportDate();
      const fetchedAccountsResponse = await getAccountsData(await getSimpleFinAuth(), lastImportDate);
      const fetchedAccountMappings = await getAccountMappings();

      const fetchedImportData = getImportData(fetchedAccountMappings, lmAccounts, fetchedAccountsResponse);
      fetchedImportData.lastImportDate = lastImportDate;
      setImportData(fetchedImportData);

      setDropdownAccountsData(Array.from(lmAccounts.values())
        .map(a => {
          console.log("how many times is this triggering");
          return {"label": a.accountName, "value": a.id}
        }));

      if (fetchedImportData.accountsToImport.size === 0) {
        // No accounts to import, lets pivot to syncing accounts
        setSyncingAccounts(true);
        setIsReady(true);
        setNoAccountsToImport(true);
        return;
      }
      setIsReady(true);
    }
  }

  const handleAccountChange = (newAccount: AppDraftAccount) => {
    importData.accountsToImport.set(newAccount.externalAccountId, newAccount);

    if (newAccount.importable) {
      importableAccounts.set(newAccount.externalAccountId, newAccount);
    } else {
      importableAccounts.delete(newAccount.externalAccountId);
    }
    handleButtonTextChange();
  }

  const handleAccountCreation = async () => {
    setCreatingAccounts(true);
    const existingAccountMappings = await getAccountMappings();
    for (const [id, accountToCreate] of importableAccounts) {
      let lmAccountId: number = accountToCreate.lmAccountId;

      if (accountToCreate.lmAccountId != null) {
        await lunchMoneyClient.updateDraftAccountBalance(accountToCreate);
      } else {
        const accountCreated = await lunchMoneyClient.createAccount(accountToCreate);
        lmAccountId = accountCreated.id;
      }

      existingAccountMappings.set(id, lmAccountId.toString());
    }
    await storeData(StorageKeys.ACCOUNT_MAPPING_KEY, Array.from(existingAccountMappings.entries()));
    moveToTransactions();
  }

  const handleSyncingAccounts = async () => {
    setSyncingAccounts(true);

    // need to gather accounts that exist (AppAccount specifically, any draft accounts were already created)
    // only sync accounts where LM account exists, we need to ensure the mapping is legitimate
    // to ensure mapping is legitimate, we can filter using lmAccounts, already present

    const accountsToSync: Map<number, AppAccount> = importData.syncedAccounts;
    for (const [id, accountToUpdate] of accountsToSync) {
      await lunchMoneyClient.updateAccountBalance(accountToUpdate);
    }
  }

  const handleNextButtonClick = async () => {
    // TODO: this should become a background task??
    await handleSyncingAccounts();

    if (noAccountsToImport) {
      moveToTransactions();
      return;
    }

    if (importableAccounts.size == 0) {
      Alert.alert("No accounts selected",
        "Are you sure you do not want to import any accounts?",
        [{text: "Ok", onPress: () => moveToTransactions()}]);
      return;
    }

    // TODO: if account being imported is an account map to existing LM account, maybe create is bad language
    Alert.alert("Create these accounts",
    `Do you want to create the following accounts?\n
    ${Array.from(importableAccounts.values()).map(v => v.accountName).join("\n")}`, [
      {text: "Cancel", style: "cancel"},
      {text: "Create", onPress: async () => await handleAccountCreation()}
    ]);
  }

  const moveToTransactions = () => {
    navigation.navigate("ImportTransactions", {
      transactionsToImport: importData.transactionsToImport,
      lunchMoneyClient: lunchMoneyClient,
      lastImportDateString: importData.lastImportDate?.toString()
    });
  }

  const separator = () => {
    return (
      <View style={{
        borderBottomColor: brandingColours.dividerColour,
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginHorizontal: 10
      }} />
    )
  }

  useEffect(() => {
    fetchDataFromSimpleFin();
  }, [navigation, importData]);

  // TODO: there are 3 loading screens here; loading all accounts, creating accounts in LM, syncing accounts in LM
  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color={brandingColours.primaryColour} />
      </View>
    )
  }

  if (noAccountsToImport) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={[commonStyles.container, { flex: 1 }]}>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text style={{ textAlign: "center" }}>
              No accounts found to import, press the button below to continue
            </Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleNextButtonClick()}>
            <Text style={styles.buttonText}>Continue to transactions</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  if (creatingAccounts || syncingAccounts) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color={brandingColours.primaryColour} />
        <Text style={{ textAlign: "center" }}>
          {creatingAccounts ? "Creating accounts..." : "Syncing existing accounts..."}
        </Text>
      </View>
    )
  }

  // User will update the accounts presented, once ready they can checkmark it
  // All checkmarked accounts can be created now when user selects "Create/Next"
  // We show alert to confirm and create accounts, then we show transactions

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[commonStyles.container, { flex: 1 }]}>

      {/* <View style={styles.card}>
        <Text style={commonStyles.headerText}>Accounts to import: {importData.accountsToImport.size}</Text>
      </View> */}

      <SectionList
        style={[commonStyles.list, { marginTop: 10, marginBottom: 0 }]}
        ItemSeparatorComponent={separator}
        sections={getGroupedAccountsForImport(importData)}
        renderSectionHeader={({ section: { title: institutionName } }) => (
          <Text style={commonStyles.sectionHeader}>{institutionName}</Text>
        )}
        renderItem={({ item }) => {
          if ('id' in item) {
            return <AccountComponent account={item} showInstitution={true} />
          } else {
            return (
              <ImportAccountComponent
                account={item}
                setUpdatedAccount={handleAccountChange}
                existingLmAccounts={dropdownAccountsData} />
            )
          }
        }}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleNextButtonClick()}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
    </SafeAreaView>
  )
}