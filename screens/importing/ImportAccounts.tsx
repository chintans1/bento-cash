import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SimpleFinImportData,
  getImportData,
} from '../../data/transformSimpleFin';
import { getAccountsData } from '../../clients/simplefinClient';
import { getSimpleFinAuth } from '../../utils/simpleFinAuth';
import { StorageKeys } from '../../models/enums/storageKeys';
import BrandingColours from '../../styles/brandingConstants';
import commonStyles from '../../styles/commonStyles';
import ImportAccountComponent from '../../components/importing/ImportAccount';
import { AppAccount, AppDraftAccount } from '../../models/lunchmoney/appModels';
import { useParentContext } from '../../context/app/appContextProvider';
import InternalLunchMoneyClient from '../../clients/lunchMoneyClient';
import { getData, storeData } from '../../utils/asyncStorage';
import { getGroupedAccountsForImport } from '../../data/utils';
import AccountComponent from '../../components/Account';

const styles = StyleSheet.create({
  card: {
    ...commonStyles.card,
    flex: 0,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 6,
  },
  button: {
    backgroundColor: BrandingColours.secondaryColour,
    marginTop: 10,
    height: 40,
    borderColor: '#8ECAE6',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: BrandingColours.shadedColour,
    fontWeight: 'bold',
    fontSize: 18,
  },
});

// TODO: need to refresh lmAccounts after account creation
// TODO: need to refresh transactions after transaction creation
export default function ImportAccountsScreen({ navigation }) {
  const { lmApiKey, accounts: lmAccounts } = useParentContext().appState;
  const lunchMoneyClient = new InternalLunchMoneyClient({ token: lmApiKey });

  const [importData, setImportData] = useState<SimpleFinImportData>(null);
  const [importableAccounts] = useState<Map<string, AppDraftAccount>>(
    new Map(),
  );

  const [isReady, setIsReady] = useState<boolean>(false);
  const [creatingAccounts, setCreatingAccounts] = useState<boolean>(false);

  const [syncingAccounts, setSyncingAccounts] = useState<boolean>(false);
  const [noAccountsToImport, setNoAccountsToImport] = useState<boolean>(false);
  const [simpleFinAccountsFound, setSimpleFinAccountsFound] =
    useState<boolean>(false);

  const [dropdownAccountsData, setDropdownAccountsData] =
    useState<{ label: string; value: number }[]>(null);

  const [buttonText, setButtonText] = useState<string>('No accounts selected');

  const getAccountMappings = async (): Promise<Map<string, string>> => {
    const existingAccountMappings = await getData(
      StorageKeys.ACCOUNT_MAPPING_KEY,
    );
    return existingAccountMappings !== null &&
      JSON.stringify(existingAccountMappings) !== '{}'
      ? new Map(existingAccountMappings)
      : new Map<string, string>();
  };

  const handleButtonTextChange = () => {
    if (importableAccounts.size === 0) {
      setButtonText('No accounts to import');
    } else if (importableAccounts.size === 1) {
      setButtonText('Import 1 account');
    } else {
      setButtonText(`Import ${importableAccounts.size} accounts`);
    }
  };

  // TODO: maybe this logic does not need to live here??
  const getLastImportDate = async (): Promise<Date> => {
    const lastImportDate = await getData(StorageKeys.LAST_DATE_OF_IMPORT);
    console.log(lastImportDate);
    return lastImportDate !== null ? new Date(lastImportDate) : new Date();
  };

  const fetchDataFromSimpleFin = useCallback(async () => {
    console.log('only fetch data from SF once');
    if (!isReady) {
      const lastImportDate = await getLastImportDate();
      const fetchedAccountsResponse = await getAccountsData(
        await getSimpleFinAuth(),
        lastImportDate,
      );
      const fetchedAccountMappings = await getAccountMappings();

      const fetchedImportData = getImportData(
        fetchedAccountMappings,
        lmAccounts,
        fetchedAccountsResponse,
      );
      fetchedImportData.lastImportDate = lastImportDate;
      setImportData(fetchedImportData);

      setDropdownAccountsData(
        Array.from(lmAccounts.values()).map(a => {
          console.log('how many times is this triggering');
          return { label: a.accountName, value: a.id };
        }),
      );

      // There are no accounts to import, but that does not mean that we got no accounts in general
      if (fetchedImportData.accountsToImport.size === 0) {
        setNoAccountsToImport(true);
      }

      // If total accounts found is > 0, we should show synced accounts list
      if (fetchedImportData.totalAccounts > 0) {
        setSimpleFinAccountsFound(true);
        if (fetchedImportData.accountsToImport.size === 0) {
          setButtonText('Continue to transactions');
        }
        setIsReady(true);
        return;
      }
      setIsReady(true);
    }
  }, [isReady, lmAccounts]);

  const moveToTransactions = () => {
    navigation.navigate('ImportTransactions', {
      transactionsToImport: importData.transactionsToImport,
      lunchMoneyClient,
      lastImportDateString: importData.lastImportDate?.toString(),
    });
  };

  const handleAccountChange = (newAccount: AppDraftAccount) => {
    importData.accountsToImport.set(newAccount.externalAccountId, newAccount);

    if (newAccount.importable) {
      importableAccounts.set(newAccount.externalAccountId, newAccount);
    } else {
      importableAccounts.delete(newAccount.externalAccountId);
    }
    handleButtonTextChange();
  };

  const handleAccountCreation = async () => {
    setCreatingAccounts(true);
    const existingAccountMappings = await getAccountMappings();
    importableAccounts.forEach((accountToCreate, id) => {
      let { lmAccountId } = accountToCreate;

      if (accountToCreate.lmAccountId !== null) {
        lunchMoneyClient
          .updateDraftAccountBalance(accountToCreate)
          .then(() => {
            existingAccountMappings.set(id, lmAccountId.toString());
          })
          .catch(error =>
            console.log(`failed to sync account balance: ${error}`),
          );
      } else {
        lunchMoneyClient
          .createAccount(accountToCreate)
          .then(createdAccount => {
            lmAccountId = createdAccount.id;
            existingAccountMappings.set(id, lmAccountId.toString());
          })
          .catch(error =>
            console.log(`failed to create account in import flow: ${error}`),
          );
      }
    });
    await storeData(
      StorageKeys.ACCOUNT_MAPPING_KEY,
      Array.from(existingAccountMappings.entries()),
    );
    moveToTransactions();
  };

  const handleSyncingAccounts = async () => {
    setSyncingAccounts(true);

    // need to gather accounts that exist (AppAccount specifically, any draft accounts were already created)
    // only sync accounts where LM account exists, we need to ensure the mapping is legitimate
    // to ensure mapping is legitimate, we can filter using lmAccounts, already present

    const accountsToSync: Map<number, AppAccount> = importData.syncedAccounts;
    accountsToSync.forEach(accountToUpdate => {
      lunchMoneyClient
        .updateAccountBalance(accountToUpdate)
        .then(() => console.log('account updated'))
        .catch(error =>
          console.log(`failed to update account balance: ${error}`),
        );
    });
  };

  const handleCancelOnProcess = () => {
    // TODO: this should just reset all states, but for now I will just close popup
    navigation.getParent()?.goBack();
  };

  const handleNextButtonClick = async () => {
    // TODO: this should become a background task??
    await handleSyncingAccounts();

    if (noAccountsToImport) {
      moveToTransactions();
      return;
    }

    if (importableAccounts.size === 0) {
      Alert.alert(
        'No accounts selected',
        'Are you sure you do not want to import any accounts?',
        [{ text: 'Ok', onPress: () => moveToTransactions() }],
      );
      return;
    }

    Alert.alert(
      'Process these accounts?',
      `Do you want to process the following accounts you had chosen to import?\n
    ${Array.from(importableAccounts.values())
      .map(v => v.accountName)
      .join('\n')}`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => handleCancelOnProcess(),
        },
        { text: 'Process', onPress: async () => handleAccountCreation() },
      ],
    );
  };

  const separator = () => {
    return (
      <View
        style={{
          borderBottomColor: BrandingColours.dividerColour,
          borderBottomWidth: StyleSheet.hairlineWidth,
          marginHorizontal: 10,
        }}
      />
    );
  };

  useEffect(() => {
    fetchDataFromSimpleFin();
  }, [navigation, importData, fetchDataFromSimpleFin]);

  // TODO: there are 3 loading screens here; loading all accounts, creating accounts in LM, syncing accounts in LM
  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={BrandingColours.primaryColour} />
      </View>
    );
  }

  if (noAccountsToImport && !simpleFinAccountsFound) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={[commonStyles.container, { flex: 1 }]}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={{ textAlign: 'center' }}>
              No accounts found to import, press the button below to continue
            </Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleNextButtonClick()}
          >
            <Text style={styles.buttonText}>Continue to transactions</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (creatingAccounts || syncingAccounts) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={BrandingColours.primaryColour} />
        <Text style={{ textAlign: 'center' }}>
          {creatingAccounts
            ? 'Creating accounts...'
            : 'Syncing existing accounts...'}
        </Text>
      </View>
    );
  }

  // User will update the accounts presented, once ready they can checkmark it
  // All checkmarked accounts can be created now when user selects "Create/Next"
  // We show alert to confirm and create accounts, then we show transactions

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[commonStyles.container, { flex: 1 }]}
      >
        <SectionList
          style={[commonStyles.list, { marginTop: 10, marginBottom: 0 }]}
          ItemSeparatorComponent={separator}
          sections={getGroupedAccountsForImport(importData)}
          renderSectionHeader={({ section: { title: institutionName } }) => (
            <Text style={commonStyles.sectionHeader}>{institutionName}</Text>
          )}
          renderItem={({ item }) => {
            if ('id' in item) {
              return <AccountComponent account={item} showInstitution />;
            }
            return (
              <ImportAccountComponent
                account={item}
                setUpdatedAccount={handleAccountChange}
                existingLmAccounts={dropdownAccountsData}
              />
            );
          }}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleNextButtonClick()}
        >
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
