import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ImportMethodSelectionScreen from './importing/ImportMethodSelection';
import SimpleFinConnectionScreen from './importing/SimpleFinConnection';

const ImportStack = createNativeStackNavigator();

const colors = {
  primary: { main: '#1A73E8', light: '#4285F4', dark: '#0D47A1' },
  secondary: { main: '#00C853', light: '#69F0AE', dark: '#009624' },
  accent: { purple: '#7C4DFF', orange: '#FF6D00', red: '#FF3D00', yellow: '#FFD600' },
  neutral: { white: '#FFFFFF', background: '#F5F5F5', lightGray: '#E0E0E0', gray: '#9E9E9E', darkGray: '#616161', black: '#212121' },
  text: { primary: '#212121', secondary: '#424242', muted: '#757575' },
};

// Main component for the import/sync flow
export default function ImportStackScreen() {
  return (
    <ImportStack.Navigator screenOptions={{ headerShown: false }}>
      <ImportStack.Screen name="ImportMethodSelection" component={ImportMethodSelectionScreen} />
      <ImportStack.Screen name="SimpleFinConnection" component={SimpleFinConnectionScreen} />
      <ImportStack.Screen name="AccountSelection" component={AccountSelectionScreen} />
      <ImportStack.Screen name="ImportSyncConfirmation" component={ImportSyncConfirmationScreen} />
      <ImportStack.Screen name="TransactionSelection" component={TransactionSelection} />
      <ImportStack.Screen name="FinalConfirmation" component={FinalConfirmationScreen} />
      <ImportStack.Screen name="Progress" component={ProgressScreen} />
      <ImportStack.Screen name="Completion" component={CompletionScreen} />
    </ImportStack.Navigator>
  );
}

// Screen 3: Account Selection
function AccountSelectionScreen({ navigation }) {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch accounts
    setTimeout(() => {
      setAccounts([
        { id: '1', name: 'Savings', balance: '100.23', exists: false },
        { id: '2', name: 'Checking', balance: '500.00', exists: true },
        { id: '3', name: 'Credit Card', balance: '-250.50', exists: false },
      ]);
      setIsLoading(false);
    }, 1500);
  }, []);

  const toggleAccountSelection = (id) => {
    setSelectedAccounts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderAccount = ({ item }) => (
    <TouchableOpacity
      style={[styles.accountItem, selectedAccounts[item.id] && styles.accountItemSelected]}
      onPress={() => toggleAccountSelection(item.id)}
    >
      <View style={styles.accountInfo}>
        <Text style={styles.accountName}>{item.name}</Text>
        <Text style={styles.accountBalance}>${item.balance}</Text>
      </View>
      <View style={styles.accountStatus}>
        {item.exists ? (
          <Text style={styles.existingAccountText}>Existing</Text>
        ) : (
          <Text style={styles.newAccountText}>New</Text>
        )}
        {selectedAccounts[item.id] && <Icon name="check" size={24} color={colors.secondary.main} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Select Accounts</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary.main} />
      ) : (
        <>
          <FlatList
            data={accounts}
            renderItem={renderAccount}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.accountList}
          />
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => navigation.navigate('ImportSyncConfirmation', { selectedAccounts })}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

// Screen 4: Import/Sync Confirmation
function ImportSyncConfirmationScreen({ route, navigation }) {
  const { selectedAccounts } = route.params;
  const [summary, setSummary] = useState({ newAccounts: 0, existingAccounts: 0 });
  // const { accounts } = useParentContext().appState;

  useEffect(() => {
    // Calculate summary based on selected accounts
    const newAccounts = Object.keys(selectedAccounts).filter(id => selectedAccounts[id] && true).length;
    const existingAccounts = Object.keys(selectedAccounts).filter(id => selectedAccounts[id] && false).length;
    setSummary({ newAccounts, existingAccounts });
  }, [selectedAccounts]);

  const handleConfirm = () => {
    if (summary.existingAccounts > 0) {
      Alert.alert(
        'Warning',
        'Syncing existing accounts will update their balances. Do you want to continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Continue', onPress: () => navigation.navigate('TransactionSelection', { selectedAccounts }) }
        ]
      );
    } else {
      navigation.navigate('TransactionSelection', { selectedAccounts });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Confirm Import/Sync</Text>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>New accounts to import: {summary.newAccounts}</Text>
        <Text style={styles.summaryText}>Existing accounts to sync: {summary.existingAccounts}</Text>
      </View>
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmButtonText}>Confirm</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Screen 5: Transaction Selection
function TransactionSelection({ route, navigation }) {
  const { selectedAccounts } = route.params;
  const [transactions, setTransactions] = useState([]);
  const [selectedTransactions, setSelectedTransactions] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch transactions
    setTimeout(() => {
      setTransactions([
        { id: '1', accountId: '1', description: 'Grocery Store', amount: -50.25, date: '2023-06-15' },
        { id: '2', accountId: '1', description: 'Salary Deposit', amount: 2000.00, date: '2023-06-01' },
        { id: '3', accountId: '2', description: 'Restaurant', amount: -75.00, date: '2023-06-10' },
      ]);
      setIsLoading(false);
    }, 1500);
  }, []);

  const toggleTransactionSelection = (id) => {
    setSelectedTransactions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderTransaction = ({ item }) => (
    <TouchableOpacity
      style={[styles.transactionItem, selectedTransactions[item.id] && styles.transactionItemSelected]}
      onPress={() => toggleTransactionSelection(item.id)}
    >
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <View style={styles.transactionAmount}>
        <Text style={[styles.transactionAmountText, item.amount < 0 ? styles.negativeAmount : styles.positiveAmount]}>
          ${Math.abs(item.amount).toFixed(2)}
        </Text>
        {selectedTransactions[item.id] && <Icon name="check" size={24} color={colors.secondary.main} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Select Transactions</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary.main} />
      ) : (
        <>
          <FlatList
            data={transactions}
            renderItem={renderTransaction}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.transactionList}
          />
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => navigation.navigate('FinalConfirmation', { selectedAccounts, selectedTransactions })}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

// Screen 6: Final Confirmation
function FinalConfirmationScreen({ route, navigation }) {
  const { selectedAccounts, selectedTransactions } = route.params;

  const handleConfirm = () => {
    navigation.navigate('Progress', { selectedAccounts, selectedTransactions });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Final Confirmation</Text>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>Accounts to import/sync: {Object.keys(selectedAccounts).filter(id => selectedAccounts[id]).length}</Text>
        <Text style={styles.summaryText}>Transactions to import: {Object.keys(selectedTransactions).filter(id => selectedTransactions[id]).length}</Text>
      </View>
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmButtonText}>Confirm and Start Import</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Screen 7: Progress
function ProgressScreen({ route, navigation }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          navigation.navigate('Completion');
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Importing...</Text>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.progressText}>{progress}% Complete</Text>
    </SafeAreaView>
  );
}

// Screen 8: Completion
function CompletionScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Import Complete</Text>
      <Icon name="check-circle" size={64} color={colors.secondary.main} style={styles.completionIcon} />
      <Text style={styles.completionText}>Your accounts and transactions have been successfully imported.</Text>
      <TouchableOpacity style={styles.viewAccountsButton} onPress={() => navigation.navigate('Accounts')}>
        <Text style={styles.viewAccountsButtonText}>View Updated Accounts</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.returnButton} onPress={() => navigation.navigate('Dashboard')}>
        <Text style={styles.returnButtonText}>Return to Dashboard</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.background,
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  importMethodList: {
    paddingVertical: 16,
  },
  importMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  importMethodItemDisabled: {
    opacity: 0.5,
  },
  importMethodText: {
    fontSize: 18,
    color: colors.text.primary,
    marginLeft: 16,
  },
  importMethodTextDisabled: {
    color: colors.text.muted,
  },
  comingSoonText: {
    fontSize: 12,
    color: colors.accent.orange,
    marginLeft: 'auto',
  },
  connectButton: {
    backgroundColor: colors.primary.main,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  connectButtonText: {
    color: colors.neutral.white,
    fontSize: 18,
    fontWeight: '600',
  },
  tokenPrompt: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 16,
  },
  accountList: {
    paddingVertical: 16,
  },
  accountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  accountItemSelected: {
    backgroundColor: colors.primary.light,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 18,
    color: colors.text.primary,
    marginBottom: 4,
  },
  accountBalance: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  accountStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  existingAccountText: {
    fontSize: 14,
    color: colors.accent.orange,
    marginRight: 8,
  },
  newAccountText: {
    fontSize: 14,
    color: colors.secondary.main,
    marginRight: 8,
  },
  continueButton: {
    backgroundColor: colors.primary.main,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  continueButtonText: {
    color: colors.neutral.white,
    fontSize: 18,
    fontWeight: '600',
  },
  summaryContainer: {
    backgroundColor: colors.neutral.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  confirmButton: {
    backgroundColor: colors.secondary.main,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: colors.neutral.white,
    fontSize: 18,
    fontWeight: '600',
  },
  transactionList: {
    paddingVertical: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  transactionItemSelected: {
    backgroundColor: colors.primary.light,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    color: colors.text.muted,
  },
  transactionAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionAmountText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  positiveAmount: {
    color: colors.secondary.main,
  },
  negativeAmount: {
    color: colors.accent.red,
  },
  progressBarContainer: {
    height: 20,
    backgroundColor: colors.neutral.lightGray,
    borderRadius: 10,
    marginVertical: 16,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary.main,
    borderRadius: 10,
  },
  progressText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  completionIcon: {
    alignSelf: 'center',
    marginVertical: 24,
  },
  completionText: {
    fontSize: 18,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  viewAccountsButton: {
    backgroundColor: colors.primary.main,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAccountsButtonText: {
    color: colors.neutral.white,
    fontSize: 18,
    fontWeight: '600',
  },
  returnButton: {
    backgroundColor: colors.neutral.lightGray,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  returnButtonText: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '600',
  },
});

// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import ImportAccountsScreen from './importing/ImportAccounts';
// import ImportTransactionsScreen from './importing/ImportTransactions';
// import ImportAccountCustomization from './importing/ImportAccountsCustomization';

// const SimpleFinImportStack = createNativeStackNavigator();

// export default function SimpleFinImportStackScreen() {
//   return (
//     <SimpleFinImportStack.Navigator
//       screenOptions={{
//         headerShown: true,
//         headerBackVisible: false,
//         gestureEnabled: false,
//       }}
//     >
//       <SimpleFinImportStack.Screen
//         name="ImportAccounts"
//         options={{
//           title: 'Importing accounts',
//           presentation: 'modal',
//         }}
//         component={ImportAccountsScreen}
//       />
//       <SimpleFinImportStack.Screen
//         name="ImportTransactions"
//         options={{
//           title: 'Importing transactions',
//         }}
//         component={ImportTransactionsScreen}
//       />
//       <SimpleFinImportStack.Screen name="AccountCustomization" component={ImportAccountCustomization} options={{ title: 'Customize Account' }} />
//     </SimpleFinImportStack.Navigator>
//   );
// }