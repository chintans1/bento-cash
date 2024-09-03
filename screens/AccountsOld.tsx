// // import { SectionList, StyleSheet, Text, View } from 'react-native';
// // import commonStyles from '../styles/commonStyles';
// // import { useParentContext } from '../context/app/appContextProvider';
// // import AccountComponent from '../components/Account';
// // import BrandingColours from '../styles/brandingConstants';
// // import { getGroupedAccountsByInstitution } from '../data/utils';
// // import { formatAmountString } from '../data/formatBalance';

// // const separator = () => {
// //   return (
// //     <View
// //       style={{
// //         borderBottomColor: BrandingColours.dividerColour,
// //         borderBottomWidth: StyleSheet.hairlineWidth,
// //         marginHorizontal: 10,
// //       }}
// //     />
// //   );
// // };

// // const styles = StyleSheet.create({
// //   card: {
// //     ...commonStyles.card,
// //     marginVertical: 0,
// //     flexDirection: 'column',
// //     flex: 0,
// //     borderRadius: 8,
// //     marginBottom: 10,
// //   },
// //   list: {
// //     ...commonStyles.list,
// //   },
// //   institutionName: {
// //     backgroundColor: BrandingColours.secondaryColour,
// //     color: BrandingColours.lightTextColour,
// //     fontWeight: 'bold',
// //     fontSize: 12,
// //     padding: 10,
// //   },
// //   amountNegative: {
// //     color: BrandingColours.red,
// //   },
// //   amountPositive: {
// //     color: BrandingColours.green,
// //   },
// // });

// // export default function Accounts() {
// //   const { accounts: accountsMap } = useParentContext().appState;
// //   const accounts = Array.from(accountsMap.values());
// //   const accountsByInstitution = getGroupedAccountsByInstitution(accounts);
// //   const netWorth = accounts
// //     .map(account => parseFloat(account.balance))
// //     .reduce((partialNw, balance) => partialNw + balance, 0);
// //   const netWorthString = formatAmountString(netWorth);

// //   return (
// //     <View style={[commonStyles.container, { flex: 1 }]}>
// //       <View style={styles.card}>
// //         <Text
// //           style={{
// //             color: BrandingColours.darkTextColour,
// //             fontSize: 20,
// //             fontWeight: 'bold',
// //           }}
// //         >
// //           Overview
// //         </Text>
// //         <Text style={{ color: BrandingColours.secondaryColour, fontSize: 16 }}>
// //           Net worth:{' '}
// //           <Text
// //             style={[
// //               netWorth >= 0 ? styles.amountPositive : styles.amountNegative,
// //               { fontWeight: 'bold' },
// //             ]}
// //           >
// //             {netWorthString}
// //           </Text>
// //         </Text>
// //       </View>

// //       <SectionList
// //         sections={accountsByInstitution}
// //         style={styles.list}
// //         ItemSeparatorComponent={separator}
// //         keyExtractor={account => account.id.toString()}
// //         renderSectionHeader={({ section: { title: institutionName } }) => (
// //           <Text style={styles.institutionName}>{institutionName}</Text>
// //         )}
// //         renderItem={({ item }) => <AccountComponent account={item} />}
// //       />
// //     </View>
// //   );
// // }

// // import React from 'react';
// // import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
// // import { LineChart, PieChart } from 'react-native-chart-kit';

// // interface Account {
// //   id: string;
// //   bank: string;
// //   name: string;
// //   balance: number;
// //   recentTransactions: Transaction[];
// // }

// // interface Transaction {
// //   id: string;
// //   name: string;
// //   amount: number;
// //   date: string;
// //   category: string;
// // }

// // const accounts: Account[] = [
// //   {
// //     id: '1',
// //     bank: 'Bank of America',
// //     name: 'Checking Account',
// //     balance: 1200.34,
// //     recentTransactions: [
// //       { id: '1', name: 'Groceries', amount: -54.23, date: '2024-06-01', category: 'Groceries' },
// //       { id: '2', name: 'Electric Bill', amount: -75.00, date: '2024-06-02', category: 'Utilities' },
// //     ],
// //   },
// //   {
// //     id: '2',
// //     bank: 'Chase',
// //     name: 'Savings Account',
// //     balance: 5230.89,
// //     recentTransactions: [
// //       { id: '3', name: 'Refund', amount: 30.50, date: '2024-06-02', category: 'Income' },
// //     ],
// //   },
// //   // Add more accounts as needed
// // ];

// // const netWorthData = {
// //   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
// //   datasets: [
// //     {
// //       data: [5000, 5500, 5800, 6000, 6200, 6500],
// //       strokeWidth: 2,
// //     },
// //   ],
// // };

// // const spendingData = [
// //   { name: 'Groceries', population: 215, color: '#FF9500', legendFontColor: '#333', legendFontSize: 12 },
// //   { name: 'Utilities', population: 280, color: '#34C759', legendFontColor: '#333', legendFontSize: 12 },
// //   { name: 'Entertainment', population: 527, color: '#007AFF', legendFontColor: '#333', legendFontSize: 12 },
// //   { name: 'Transportation', population: 853, color: '#FF3B30', legendFontColor: '#333', legendFontSize: 12 },
// //   { name: 'Other', population: 1198, color: '#AF52DE', legendFontColor: '#333', legendFontSize: 12 },
// // ];

// // const AccountsScreen: React.FC = () => {
// //   return (
// //     <ScrollView style={styles.container}>
// //       <Text style={styles.header}>Net Worth</Text>
// //       <LineChart
// //         data={netWorthData}
// //         width={320}
// //         height={220}
// //         chartConfig={chartConfig}
// //         bezier
// //         style={styles.chart}
// //       />

// //       <Text style={styles.header}>Accounts</Text>
// //       <FlatList
// //         data={accounts}
// //         renderItem={({ item }) => (
// //           <View style={styles.accountCard}>
// //             <View style={styles.accountHeader}>
// //               <Text style={styles.bankName}>{item.bank}</Text>
// //               <Text style={styles.accountName}>{item.name}</Text>
// //               <Text style={styles.balance}>${item.balance.toFixed(2)}</Text>
// //             </View>
// //             <View style={styles.recentTransactions}>
// //               <Text style={styles.subHeader}>Recent Transactions</Text>
// //               {item.recentTransactions.map((transaction) => (
// //                 <View key={transaction.id} style={styles.transaction}>
// //                   <Text style={styles.transactionName}>{transaction.name}</Text>
// //                   <Text style={styles.transactionAmount}>{transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}</Text>
// //                 </View>
// //               ))}
// //             </View>
// //           </View>
// //         )}
// //         keyExtractor={(item) => item.id}
// //       />

// //       <Text style={styles.header}>Categorized Spending</Text>
// //       <PieChart
// //         data={spendingData}
// //         width={320}
// //         height={220}
// //         chartConfig={chartConfig}
// //         accessor="population"
// //         backgroundColor="transparent"
// //         paddingLeft="15"
// //         style={styles.chart}
// //       />

// //       <Text style={styles.header}>Upcoming Bills</Text>
// //       {/* Add upcoming bills/transactions list here */}
// //     </ScrollView>
// //   );
// // };

// // export default AccountsScreen;

// // const chartConfig = {
// //   backgroundGradientFrom: '#fff',
// //   backgroundGradientTo: '#fff',
// //   color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
// //   labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
// //   propsForDots: {
// //     r: '6',
// //     strokeWidth: '2',
// //     stroke: '#ffa726',
// //   },
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#fff',
// //     padding: 15,
// //   },
// //   header: {
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //     color: '#333',
// //     marginBottom: 10,
// //   },
// //   subHeader: {
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     color: '#555',
// //     marginTop: 10,
// //     marginBottom: 5,
// //   },
// //   chart: {
// //     marginVertical: 10,
// //     borderRadius: 16,
// //   },
// //   accountCard: {
// //     backgroundColor: '#f9f9f9',
// //     borderRadius: 10,
// //     padding: 15,
// //     marginBottom: 15,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 3,
// //   },
// //   accountHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 10,
// //   },
// //   bankName: {
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     color: '#333',
// //   },
// //   accountName: {
// //     fontSize: 14,
// //     color: '#666',
// //   },
// //   balance: {
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     color: '#007AFF',
// //   },
// //   recentTransactions: {
// //     marginTop: 10,
// //   },
// //   transaction: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     marginBottom: 5,
// //   },
// //   transactionName: {
// //     fontSize: 14,
// //     color: '#333',
// //   },
// //   transactionAmount: {
// //     fontSize: 14,
// //     fontWeight: 'bold',
// //     color: '#FF9500',
// //   },
// // });

// import React from 'react';
// import { View, Text, StyleSheet, FlatList } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// const sampleAccounts = [
//   {
//     id: '1',
//     name: 'Checking Account',
//     bank: 'Chase',
//     balance: 6540.92,
//     type: 'Credit',
//     lastUpdated: '2024-06-08',
//   },
//   {
//     id: '2',
//     name: 'Savings Account',
//     bank: 'Bank of America',
//     balance: 7670.05,
//     type: 'Depository',
//     lastUpdated: '2024-06-08',
//   },
//   {
//     id: '3',
//     name: 'Investment Account',
//     bank: 'Robinhood',
//     balance: 8076.0,
//     type: 'Investment',
//     lastUpdated: '2024-06-08',
//   },
// ];

// const AccountsScreen: React.FC = () => {
//   const renderAccount = ({ item }) => (
//     <View style={styles.accountCard}>
//       <View style={styles.accountInfo}>
//         <View style={styles.accountDetails}>
//           <Text style={styles.accountName}>{item.name}</Text>
//           <Text style={styles.accountBank}>{item.bank}</Text>
//         </View>
//         <View style={styles.accountDetailsRight}>
//           <Text style={styles.accountBalance}>${item.balance.toFixed(2)}</Text>
//           <Text style={styles.accountLastUpdated}>
//             Updated: {item.lastUpdated}
//           </Text>
//         </View>
//       </View>
//       <Ionicons name="chevron-forward" size={24} color="#A1A1A1" />
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Accounts</Text>
//       <FlatList
//         data={sampleAccounts}
//         renderItem={renderAccount}
//         keyExtractor={item => item.id}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#FFFFFF',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#333333',
//   },
//   accountCard: {
//     backgroundColor: '#F9F9F9',
//     padding: 15,
//     marginBottom: 10,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#DDDDDD',
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 2,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   accountInfo: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     flex: 1,
//   },
//   accountDetails: {
//     flex: 1,
//   },
//   accountDetailsRight: {
//     alignItems: 'flex-end',
//   },
//   accountName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333333',
//   },
//   accountBank: {
//     fontSize: 14,
//     color: '#A1A1A1',
//   },
//   accountBalance: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#00ACC1',
//   },
//   accountLastUpdated: {
//     fontSize: 12,
//     color: '#A1A1A1',
//   },
// });

// export default AccountsScreen;
