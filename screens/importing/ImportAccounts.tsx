// import { useCallback, useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   SafeAreaView,
//   SectionList,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import Toast from 'react-native-toast-message';
// import {
//   SimpleFinImportData,
//   getImportData,
// } from '../../data/transformSimpleFin';
// import { getAccountsData } from '../../clients/simplefinClient';
// import { getSimpleFinAuth } from '../../utils/simpleFinAuth';
// import { StorageKeys } from '../../models/enums/storageKeys';
// import BrandingColours from '../../styles/brandingConstants';
// import commonStyles from '../../styles/commonStyles';
// import ImportAccountComponent from '../../components/importing/ImportAccount';
// import {
//   AccountType,
//   AppAccount,
//   AppDraftAccount,
// } from '../../models/lunchmoney/appModels';
// import { useParentContext } from '../../context/app/appContextProvider';
// import InternalLunchMoneyClient from '../../clients/lunchMoneyClient';
// import { getData, storeData } from '../../utils/asyncStorage';
// import { getGroupedAccountsForImport } from '../../data/utils';
// import AccountComponent from '../../components/Account';
// import { AccountsResponse } from '../../models/simplefin/accounts';

// const styles = StyleSheet.create({
//   card: {
//     ...commonStyles.card,
//     flex: 0,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginVertical: 6,
//   },
//   button: {
//     backgroundColor: BrandingColours.secondaryColour,
//     marginTop: 10,
//     height: 40,
//     borderColor: '#8ECAE6',
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   buttonText: {
//     color: BrandingColours.shadedColour,
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
// });

// // TODO: need to refresh lmAccounts after account creation
// // TODO: need to refresh transactions after transaction creation
// export default function ImportAccountsScreen({ navigation }) {
//   const { lmApiKey, accounts: lmAccounts } = useParentContext().appState;
//   const lunchMoneyClient = new InternalLunchMoneyClient({ token: lmApiKey });

//   const [importData, setImportData] = useState<SimpleFinImportData>(null);
//   const [importableAccounts] = useState<Map<string, AppDraftAccount>>(
//     new Map(),
//   );

//   const [isReady, setIsReady] = useState<boolean>(false);
//   const [creatingAccounts, setCreatingAccounts] = useState<boolean>(false);

//   const [syncingAccounts, setSyncingAccounts] = useState<boolean>(false);
//   const [noAccountsToImport, setNoAccountsToImport] = useState<boolean>(false);
//   const [simpleFinAccountsFound, setSimpleFinAccountsFound] =
//     useState<boolean>(false);

//   const [dropdownAccountsData, setDropdownAccountsData] =
//     useState<{ label: string; value: number }[]>(null);

//   const [buttonText, setButtonText] = useState<string>('No accounts selected');

//   const getAccountMappings = async (): Promise<Map<string, string>> => {
//     const existingAccountMappings = await getData(
//       StorageKeys.ACCOUNT_MAPPING_KEY,
//     );
//     return existingAccountMappings !== null &&
//       JSON.stringify(existingAccountMappings) !== '{}'
//       ? new Map(existingAccountMappings)
//       : new Map<string, string>();
//   };

//   const handleButtonTextChange = () => {
//     if (importableAccounts.size === 0) {
//       setButtonText('No accounts to import');
//     } else if (importableAccounts.size === 1) {
//       setButtonText('Import 1 account');
//     } else {
//       setButtonText(`Import ${importableAccounts.size} accounts`);
//     }
//   };

//   // TODO: maybe this logic does not need to live here??
//   const getLastImportDate = async (): Promise<Date> => {
//     const lastImportDate = await getData(StorageKeys.LAST_DATE_OF_IMPORT);
//     console.log(lastImportDate);
//     return lastImportDate !== null ? new Date(lastImportDate) : new Date();
//   };

//   const fetchDataFromSimpleFin = useCallback(async () => {
//     if (!isReady) {
//       console.log('only fetch data from SF once');
//       const lastImportDate = await getLastImportDate();
//       let fetchedAccountsResponse: AccountsResponse;
//       try {
//         fetchedAccountsResponse = await getAccountsData(
//           await getSimpleFinAuth(),
//           lastImportDate,
//         );
//       } catch (err) {
//         Alert.alert('An error occurred', `${err}`, [
//           { text: 'Ok', onPress: () => navigation.getParent()?.goBack() },
//         ]);
//       }
//       const fetchedAccountMappings = await getAccountMappings();

//       const fetchedImportData = getImportData(
//         fetchedAccountMappings,
//         lmAccounts,
//         fetchedAccountsResponse,
//       );
//       fetchedImportData.lastImportDate = lastImportDate;
//       setImportData(fetchedImportData);

//       setDropdownAccountsData(
//         Array.from(lmAccounts.values()).map(a => {
//           return { label: a.accountName, value: a.id };
//         }),
//       );

//       // There are no accounts to import, but that does not mean that we got no accounts in general
//       if (fetchedImportData.accountsToImport.size === 0) {
//         setNoAccountsToImport(true);
//       }

//       // If total accounts found is > 0, we should show synced accounts list
//       if (fetchedImportData.totalAccounts > 0) {
//         setSimpleFinAccountsFound(true);
//         if (fetchedImportData.accountsToImport.size === 0) {
//           setButtonText('Continue to transactions');
//         }
//         setIsReady(true);
//         return;
//       }
//       setIsReady(true);
//     }
//   }, [isReady, lmAccounts, navigation]);

//   const moveToTransactions = () => {
//     navigation.navigate('ImportTransactions', {
//       transactionsToImport: importData.transactionsToImport,
//       lunchMoneyClient,
//       lastImportDateString: importData.lastImportDate?.toString(),
//     });
//   };

//   const handleAccountChange = (newAccount: AppDraftAccount) => {
//     importData.accountsToImport.set(newAccount.externalAccountId, newAccount);

//     if (newAccount.importable) {
//       importableAccounts.set(newAccount.externalAccountId, newAccount);
//     } else {
//       importableAccounts.delete(newAccount.externalAccountId);
//     }
//     handleButtonTextChange();
//   };

//   const handleAccountCreation = async () => {
//     setCreatingAccounts(true);

//     const existingAccountMappings = await getAccountMappings();
//     const promises: Promise<void>[] = [];

//     importableAccounts.forEach(async (accountToCreate, id) => {
//       let { lmAccountId } = accountToCreate;

//       if (lmAccountId !== null) {
//         let accountType: AccountType | undefined;
//         if (lmAccounts.has(lmAccountId)) {
//           accountType = lmAccounts.get(lmAccountId).type;
//         }

//         const updatePromise = lunchMoneyClient
//           .updateDraftAccountBalance({
//             ...accountToCreate,
//             type: accountType,
//           })
//           .then(() => {
//             existingAccountMappings.set(id, lmAccountId.toString());
//           })
//           .catch(err =>
//             console.error(`Failed to sync account balance: ${err}`),
//           );

//         promises.push(updatePromise);
//       } else {
//         const createPromise = lunchMoneyClient
//           .createAccount(accountToCreate)
//           .then(createdAccount => {
//             lmAccountId = createdAccount.id;
//             existingAccountMappings.set(id, lmAccountId.toString());
//           })
//           .catch(err =>
//             console.error(`Failed to create account in import flow: ${err}`),
//           );

//         promises.push(createPromise);
//       }
//     });

//     await Promise.all(promises);

//     await storeData(
//       StorageKeys.ACCOUNT_MAPPING_KEY,
//       Array.from(existingAccountMappings.entries()),
//     );
//     moveToTransactions();
//   };

//   const handleSyncingAccounts = async () => {
//     setSyncingAccounts(true);

//     // need to gather accounts that exist (AppAccount specifically, any draft accounts were already created)
//     // only sync accounts where LM account exists, we need to ensure the mapping is legitimate
//     // to ensure mapping is legitimate, we can filter using lmAccounts, already present

//     const accountsToSync: Map<number, AppAccount> = importData.syncedAccounts;
//     accountsToSync.forEach(accountToUpdate => {
//       lunchMoneyClient
//         .updateAccountBalance(accountToUpdate)
//         .then(() => console.log('account updated'))
//         .catch(error =>
//           console.log(`failed to update account balance: ${error}`),
//         );
//     });
//   };

//   const handleCancelOnProcess = () => {
//     // TODO: this should just reset all states, but for now I will just close popup
//     navigation.getParent()?.goBack();
//   };

//   const handleNextButtonClick = async () => {
//     // TODO: this should become a background task??
//     await handleSyncingAccounts();

//     if (noAccountsToImport) {
//       moveToTransactions();
//       return;
//     }

//     if (importableAccounts.size === 0) {
//       Alert.alert(
//         'No accounts selected',
//         'Are you sure you do not want to import any accounts?',
//         [{ text: 'Ok', onPress: () => moveToTransactions() }],
//       );
//       return;
//     }

//     Alert.alert(
//       'Process these accounts?',
//       `Do you want to process the following accounts you had chosen to import?\n
//     ${Array.from(importableAccounts.values())
//       .map(v => v.accountName)
//       .join('\n')}`,
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel',
//           onPress: () => handleCancelOnProcess(),
//         },
//         { text: 'Process', onPress: async () => handleAccountCreation() },
//       ],
//     );
//   };

//   const separator = () => {
//     return (
//       <View
//         style={{
//           borderBottomColor: BrandingColours.dividerColour,
//           borderBottomWidth: StyleSheet.hairlineWidth,
//           marginHorizontal: 10,
//         }}
//       />
//     );
//   };

//   useEffect(() => {
//     fetchDataFromSimpleFin();
//   }, [navigation, importData, fetchDataFromSimpleFin]);

//   // TODO: there are 3 loading screens here; loading all accounts, creating accounts in LM, syncing accounts in LM
//   if (!isReady) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center' }}>
//         <Toast />
//         <ActivityIndicator size="large" color={BrandingColours.primaryColour} />
//       </View>
//     );
//   }

//   if (noAccountsToImport && !simpleFinAccountsFound) {
//     return (
//       <SafeAreaView style={{ flex: 1 }}>
//         <Toast />
//         <View style={[commonStyles.container, { flex: 1 }]}>
//           <View style={{ flex: 1, justifyContent: 'center' }}>
//             <Text style={{ textAlign: 'center' }}>
//               No accounts found to import, press the button below to continue
//             </Text>
//           </View>
//           <TouchableOpacity
//             style={styles.button}
//             onPress={() => handleNextButtonClick()}
//           >
//             <Text style={styles.buttonText}>Continue to transactions</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   if (creatingAccounts || syncingAccounts) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center' }}>
//         <Toast />
//         <ActivityIndicator size="large" color={BrandingColours.primaryColour} />
//         <Text style={{ textAlign: 'center' }}>
//           {creatingAccounts
//             ? 'Creating accounts...'
//             : 'Syncing existing accounts...'}
//         </Text>
//       </View>
//     );
//   }

//   // User will update the accounts presented, once ready they can checkmark it
//   // All checkmarked accounts can be created now when user selects "Create/Next"
//   // We show alert to confirm and create accounts, then we show transactions

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={[commonStyles.container, { flex: 1 }]}
//       >
//         <SectionList
//           style={[commonStyles.list, { marginTop: 10, marginBottom: 0 }]}
//           ItemSeparatorComponent={separator}
//           sections={getGroupedAccountsForImport(importData)}
//           renderSectionHeader={({ section: { title: institutionName } }) => (
//             <Text style={commonStyles.sectionHeader}>{institutionName}</Text>
//           )}
//           renderItem={({ item }) => {
//             if ('id' in item) {
//               return <AccountComponent account={item} showInstitution />;
//             }
//             return (
//               <ImportAccountComponent
//                 account={item}
//                 setUpdatedAccount={handleAccountChange}
//                 existingLmAccounts={dropdownAccountsData}
//               />
//             );
//           }}
//         />

//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => handleNextButtonClick()}
//         >
//           <Text style={styles.buttonText}>{buttonText}</Text>
//         </TouchableOpacity>
//         <Toast />
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, ScrollView } from 'react-native';
// import { Picker } from '@react-native-picker/picker';

// // Sample data for existing accounts
// const existingAccounts = [
//   { id: '1', name: 'Checking Account', bank: 'Bank of America' },
//   { id: '2', name: 'Savings Account', bank: 'Chase' },
//   { id: '3', name: 'Credit Card', bank: 'Discover' },
// ];

// // Sample data for API returned accounts
// const apiAccounts = [
//   { id: '4', name: 'New Checking Account', bank: 'Wells Fargo', balance: 1500 },
//   { id: '5', name: 'New Savings Account', bank: 'Ally Bank', balance: 5000 },
// ];

// const AccountImportScreen: React.FC = ({ navigation }) => {
//   const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
//   const [showAccountMappingModal, setShowAccountMappingModal] = useState<boolean>(false);
//   const [accountMappings, setAccountMappings] = useState<{ [key: string]: string }>({});

//   const handleAccountSelection = (accountId: string) => {
//     const updatedSelection = selectedAccounts.includes(accountId)
//       ? selectedAccounts.filter((id) => id !== accountId)
//       : [...selectedAccounts, accountId];
//     setSelectedAccounts(updatedSelection);
//   };

//   const handleImportAccount = () => {
//     if (selectedAccounts.length > 0) {
//       setShowAccountMappingModal(true);
//     }

//     navigation.navigate('ImportTransactions', {
//             // transactionsToImport: importData.transactionsToImport,
//             // lunchMoneyClient,
//             // lastImportDateString: importData.lastImportDate?.toString(),
//           });
//   };

//   const handleMapToExistingAccount = () => {
//     setShowAccountMappingModal(false);
//     // Perform the mapping logic here with accountMappings state
//   };

//   const handlePickerChange = (accountId: string, selectedValue: string) => {
//     setAccountMappings((prevMappings) => ({
//       ...prevMappings,
//       [accountId]: selectedValue,
//     }));
//   };

//   const renderAccount = ({ item }) => (
//     <TouchableOpacity
//       key={item.id}
//       style={[styles.accountCard, selectedAccounts.includes(item.id) && styles.selectedAccount]}
//       onPress={() => handleAccountSelection(item.id)}
//     >
//       <Text style={styles.accountName}>{item.name}</Text>
//       <Text style={styles.bankName}>{item.bank}</Text>
//       <Text style={styles.balance}>${item.balance.toFixed(2)}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Import Accounts</Text>
//       <FlatList
//         data={apiAccounts}
//         renderItem={renderAccount}
//         keyExtractor={(item) => item.id}
//       />
//       <TouchableOpacity style={styles.importButton} onPress={handleImportAccount}>
//         <Text style={styles.buttonText}>Import Selected</Text>
//       </TouchableOpacity>

//       <Modal
//         visible={showAccountMappingModal}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setShowAccountMappingModal(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalHeader}>Map to Existing Accounts</Text>
//             <ScrollView>
//               {selectedAccounts.map((accountId) => {
//                 const account = apiAccounts.find((acc) => acc.id === accountId);
//                 return (
//                   <View key={accountId} style={styles.mappingContainer}>
//                     <Text style={styles.mappingLabel}>Map {account?.name} ({account?.bank})</Text>
//                     <Picker
//                       selectedValue={accountMappings[accountId] || 'new'}
//                       onValueChange={(itemValue) => handlePickerChange(accountId, itemValue)}
//                     >
//                       <Picker.Item label="Create New Account" value="new" />
//                       {existingAccounts.map((existingAccount) => (
//                         <Picker.Item
//                           key={existingAccount.id}
//                           label={`${existingAccount.name} (${existingAccount.bank})`}
//                           value={existingAccount.id}
//                         />
//                       ))}
//                     </Picker>
//                   </View>
//                 );
//               })}
//             </ScrollView>
//             <TouchableOpacity style={styles.mapButton} onPress={handleMapToExistingAccount}>
//               <Text style={styles.buttonText}>Map Accounts</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#F9FAFB',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#333',
//   },
//   accountCard: {
//     backgroundColor: '#fff',
//     padding: 15,
//     marginBottom: 10,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 2,
//   },
//   selectedAccount: {
//     backgroundColor: '#E0F7FA',
//     borderColor: '#00ACC1',
//   },
//   accountName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 5,
//     color: '#333',
//   },
//   bankName: {
//     fontSize: 16,
//     color: '#666',
//   },
//   balance: {
//     fontSize: 16,
//     color: '#333',
//   },
//   importButton: {
//     backgroundColor: '#00ACC1',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   buttonText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 8,
//     width: '80%',
//     maxHeight: '80%',
//   },
//   modalHeader: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   mappingContainer: {
//     marginBottom: 20,
//   },
//   mappingLabel: {
//     fontSize: 16,
//     marginBottom: 5,
//     color: '#333',
//   },
//   mapButton: {
//     backgroundColor: '#00ACC1',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 20,
//   },
// });

// export default AccountImportScreen;

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

interface ImportableAccount {
  id: number;
  bank: string;
  name: string;
  amount: number;
}

interface ExistingAccount {
  id: number;
  name: string;
}

const dummyImportableAccounts: ImportableAccount[] = [
  { id: 1, bank: 'Chase Bank', name: 'Checking', amount: 1000 },
  { id: 2, bank: 'Robinhood', name: 'Investing', amount: 2000 },
];

const dummyExistingAccounts: ExistingAccount[] = [
  { id: 101, name: 'Chase Bank - Checking' },
  { id: 102, name: 'Robinhood - Investing' },
];

const ImportAccountsScreen: React.FC = () => {
  const [selectedImportableAccount, setSelectedImportableAccount] = useState<ImportableAccount | null>(null);
  const [selectedExistingAccount, setSelectedExistingAccount] = useState<ExistingAccount | null>(null);

  const handleSelectImportableAccount = (account: ImportableAccount) => {
    setSelectedImportableAccount(account);
  };

  const handleSelectExistingAccount = (accountId: number) => {
    const account = dummyExistingAccounts.find((item) => item.id === accountId);
    setSelectedExistingAccount(account || null);
  };

  const handleImportAccount = () => {
    if (selectedImportableAccount && selectedExistingAccount) {
      console.log('Importing account:', selectedImportableAccount.name, 'and mapping to:', selectedExistingAccount.name);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Import Accounts</Text>

      <Text style={styles.subtitle}>Select an account to import:</Text>
      <FlatList
        data={dummyImportableAccounts}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, selectedImportableAccount?.id === item.id ? styles.selectedCard : null]}
            onPress={() => handleSelectImportableAccount(item)}
          >
            <Text style={styles.cardText}>{item.bank}</Text>
            <Text style={styles.cardText}>{item.name}</Text>
            <Text style={styles.cardText}>${item.amount}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      <Text style={styles.subtitle}>Map to an existing account:</Text>
      <FlatList
        data={dummyExistingAccounts}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, selectedExistingAccount?.id === item.id ? styles.selectedCard : null]}
            onPress={() => handleSelectExistingAccount(item.id)}
          >
            <Text style={styles.cardText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#27ae60' }]}
        onPress={handleImportAccount}
        disabled={!selectedImportableAccount || !selectedExistingAccount}
      >
        <Text style={styles.buttonText}>Import Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#2c3e50',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  cardText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  selectedCard: {
    borderColor: '#3498db',
  },
  button: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ImportAccountsScreen;
