// import {
//   ActivityIndicator,
//   Alert,
//   SafeAreaView,
//   SectionList,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { useCallback, useEffect, useState } from 'react';
// import DateTimePicker, {
//   DateTimePickerEvent,
// } from '@react-native-community/datetimepicker';
// import Toast from 'react-native-toast-message';
// import {
//   AppCategory,
//   AppDraftTransaction,
// } from '../../models/lunchmoney/appModels';
// import commonStyles from '../../styles/commonStyles';
// import BrandingColours from '../../styles/brandingConstants';
// import { useParentContext } from '../../context/app/appContextProvider';
// import InternalLunchMoneyClient from '../../clients/lunchMoneyClient';
// import { getDraftTransactions } from '../../data/transformLunchMoney';
// import { getParsedTransactions } from '../../data/transformSimpleFin';
// import { getAccountsData } from '../../clients/simplefinClient';
// import { getSimpleFinAuth } from '../../utils/simpleFinAuth';
// import { StorageKeys } from '../../models/enums/storageKeys';
// import { storeData } from '../../utils/asyncStorage';
// import { getGroupedDraftTransactionsByAccount } from '../../data/utils';
// import ImportTransactionComponent from '../../components/importing/ImportTransaction';

// const styles = StyleSheet.create({
//   card: {
//     ...commonStyles.card,
//     flex: 0,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginVertical: 8,
//     justifyContent: 'space-between',
//   },
//   button: {
//     backgroundColor: BrandingColours.secondaryColour,
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

// export default function ImportTransactionsScreen({ route, navigation }) {
//   const {
//     transactionsToImport,
//     lunchMoneyClient,
//     lastImportDateString,
//   }: {
//     transactionsToImport: AppDraftTransaction[];
//     lunchMoneyClient: InternalLunchMoneyClient;
//     lastImportDateString: string;
//   } = route.params;
//   const { categories } = useParentContext().appState;

//   const [categoriesAvailable, setCategoriesAvailable] = useState<
//     { label: string; value: AppCategory }[]
//   >([]);
//   const [isReady, setIsReady] = useState<boolean>(false);

//   const [importDate, setImportDate] = useState<Date>(
//     new Date(lastImportDateString),
//   );
//   const [isFetchingTransactions, setIsFetchingTransactions] =
//     useState<boolean>(false);
//   const [importingTransactions, setImportingTransactions] =
//     useState<AppDraftTransaction[]>(transactionsToImport);

//   const [selectedTransactions] = useState<Map<string, AppDraftTransaction>>(
//     new Map(),
//   );
//   const [creatingTransactions, setCreatingTransactions] =
//     useState<boolean>(false);

//   const [buttonText, setButtonText] = useState<string>(
//     'No transactions selected',
//   );

//   const handleButtonTextChange = () => {
//     if (selectedTransactions.size === 0) {
//       setButtonText('No transactions selected');
//     } else if (selectedTransactions.size === 1) {
//       setButtonText('Import 1 transaction');
//     } else {
//       setButtonText(`Import ${selectedTransactions.size} transactions`);
//     }
//   };

//   const populateAvailableCategories = useCallback(() => {
//     if (!isReady && categories != null) {
//       console.log('categories is updating too often');
//       setCategoriesAvailable(
//         categories
//           .filter(category => !category.isGroup)
//           .map(category => {
//             return { label: category.name, value: category };
//           }),
//       );
//     }
//     setIsReady(true);
//   }, [isReady, categories]);

//   const handleDateChange = async (event: DateTimePickerEvent, date: Date) => {
//     // TODO: we should get simplefinAuth from global state
//     setImportDate(date);
//     if (event.type === 'dismissed') {
//       setIsFetchingTransactions(true);
//       await storeData(StorageKeys.LAST_DATE_OF_IMPORT, date.toISOString());

//       const parsedTransactions = getParsedTransactions(
//         await getAccountsData(await getSimpleFinAuth(), date),
//       );
//       setImportingTransactions(parsedTransactions);
//       setIsFetchingTransactions(false);
//     }
//   };

//   const handleTransactionUpdate = (updatedTransaction: AppDraftTransaction) => {
//     if (updatedTransaction.importable) {
//       selectedTransactions.set(
//         updatedTransaction.externalId,
//         updatedTransaction,
//       );
//     } else {
//       selectedTransactions.delete(updatedTransaction.externalId);
//     }
//     handleButtonTextChange();
//   };

//   const handleTransactionsCreation = async () => {
//     if (selectedTransactions.size === 0) {
//       Alert.alert('No transactions were imported', null, [
//         { text: 'Ok', onPress: () => navigation.getParent()?.goBack() },
//       ]);
//       return;
//     }

//     setCreatingTransactions(true);

//     const draftTransactions = getDraftTransactions(
//       Array.from(selectedTransactions.values()),
//     );
//     await lunchMoneyClient.createTransactions(draftTransactions);

//     Alert.alert(
//       'Transactions succussfully created!',
//       'Your transaction data should be available to view on Lunch Money now',
//       [{ text: 'Ok', onPress: () => navigation.getParent()?.goBack() }],
//     );
//   };

//   const handleImportButtonClick = () => {
//     Alert.alert(
//       selectedTransactions.size === 0
//         ? 'No transactions selected'
//         : `Importing ${selectedTransactions.size} transactions`,
//       'Do you want to continue?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: selectedTransactions.size === 0 ? 'Yes' : 'Import',
//           onPress: () => handleTransactionsCreation(),
//         },
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
//     const populateCategories = () => populateAvailableCategories();

//     populateCategories();
//   }, [navigation, isReady, populateAvailableCategories]);

//   if (!isReady) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center' }}>
//         <Toast />
//         <ActivityIndicator size="large" color={BrandingColours.primaryColour} />
//       </View>
//     );
//   }

//   if (isFetchingTransactions) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center' }}>
//         <Toast />
//         <ActivityIndicator size="large" color={BrandingColours.primaryColour} />
//         <Text style={{ textAlign: 'center' }}>Fetching transactions...</Text>
//       </View>
//     );
//   }

//   if (creatingTransactions) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center' }}>
//         <Toast />
//         <ActivityIndicator size="large" color={BrandingColours.primaryColour} />
//         <Text style={{ textAlign: 'center' }}>Importing transactions...</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <View style={[commonStyles.container]}>
//         <Toast />
//         <View style={styles.card}>
//           <View style={{ flex: 1 }}>
//             <Text style={{ color: BrandingColours.darkTextColour }}>
//               Importing transactions from
//             </Text>
//           </View>
//           <DateTimePicker
//             accentColor={BrandingColours.secondaryColour}
//             textColor={BrandingColours.darkTextColour}
//             themeVariant="light"
//             style={{ alignSelf: 'flex-end' }}
//             mode="date"
//             value={importDate}
//             maximumDate={new Date()}
//             onChange={handleDateChange}
//           />
//         </View>
//         <SectionList
//           style={[commonStyles.list, { marginBottom: 8 }]}
//           contentContainerStyle={{ flexGrow: 1 }}
//           ItemSeparatorComponent={separator}
//           sections={getGroupedDraftTransactionsByAccount(importingTransactions)}
//           renderSectionHeader={({ section: { title: accountName } }) => (
//             <Text style={commonStyles.sectionHeader}>{accountName}</Text>
//           )}
//           renderItem={({ item }) => (
//             <ImportTransactionComponent
//               transaction={item}
//               updateTransaction={handleTransactionUpdate}
//               availableCategories={categoriesAvailable}
//             />
//           )}
//           ListEmptyComponent={
//             <View
//               style={{
//                 flex: 1,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//               }}
//             >
//               <Text
//                 style={{
//                   textAlign: 'center',
//                   color: BrandingColours.darkTextColour,
//                 }}
//               >
//                 No transactions found, try changing the date
//               </Text>
//             </View>
//           }
//         />

//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => handleImportButtonClick()}
//         >
//           <Text style={styles.buttonText}>{buttonText}</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const sampleTransactions = [
  { id: '1', name: 'Groceries', amount: -50.75, date: '2024-06-01', account: 'Checking Account', category: 'Food', status: 'pending' },
  { id: '2', name: 'Salary', amount: 2500.00, date: '2024-06-03', account: 'Checking Account', category: 'Income', status: 'pending' },
  { id: '3', name: 'Electric Bill', amount: -75.60, date: '2024-06-05', account: 'Savings Account', category: 'Utilities', status: 'pending' },
];

const categories = ['Food', 'Income', 'Utilities', 'Entertainment', 'Transportation'];

const TransactionsImportScreen: React.FC = () => {
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [transactionCategories, setTransactionCategories] = useState<{ [key: string]: string }>({});

  const handleTransactionSelection = (transactionId: string) => {
    const updatedSelection = selectedTransactions.includes(transactionId)
      ? selectedTransactions.filter((id) => id !== transactionId)
      : [...selectedTransactions, transactionId];
    setSelectedTransactions(updatedSelection);
  };

  const handlePickerChange = (transactionId: string, selectedCategory: string) => {
    setTransactionCategories((prevCategories) => ({
      ...prevCategories,
      [transactionId]: selectedCategory,
    }));
  };

  const handleImportTransactions = () => {
    // Handle the import logic here
  };

  const renderTransaction = ({ item }) => (
    <View style={[styles.transactionCard, selectedTransactions.includes(item.id) && styles.selectedTransaction]}>
      <TouchableOpacity onPress={() => handleTransactionSelection(item.id)}>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionName}>{item.name}</Text>
          <Text style={[styles.transactionAmount, item.amount > 0 ? styles.credit : styles.debit]}>
            ${item.amount.toFixed(2)}
          </Text>
        </View>
        <Text style={styles.transactionDate}>{item.date}</Text>
        <Text style={styles.transactionAccount}>{item.account}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={transactionCategories[item.id] || 'Uncategorized'}
            onValueChange={(itemValue) => handlePickerChange(item.id, itemValue)}
          >
            {categories.map((category) => (
              <Picker.Item key={category} label={category} value={category} />
            ))}
          </Picker>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Import Transactions</Text>
      <FlatList
        data={sampleTransactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity style={styles.importButton} onPress={handleImportTransactions}>
        <Text style={styles.buttonText}>Import Selected</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  transactionCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  selectedTransaction: {
    backgroundColor: '#E0F7FA',
    borderColor: '#00ACC1',
  },
  transactionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  credit: {
    color: '#4CAF50',
  },
  debit: {
    color: '#F44336',
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
  },
  transactionAccount: {
    fontSize: 14,
    color: '#666',
  },
  pickerContainer: {
    marginTop: 10,
  },
  importButton: {
    backgroundColor: '#00ACC1',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default TransactionsImportScreen;

