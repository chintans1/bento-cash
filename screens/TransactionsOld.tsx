import { SectionList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { format, isToday, isTomorrow, isYesterday, parseISO } from 'date-fns';
import commonStyles from '../styles/oldCommonStyles';
import TransactionComponent from '../components/Transaction';
import { useParentContext } from '../context/app/appContextProvider';
import { BrandingColours } from '../styles/brandingConstants';
import { getGroupedTransactionsByDate } from '../data/utils';
import SectionHeader from '../components/SectionHeader';

const renderNoStateMessage = () => {
  return (
    <View>
      <Text style={commonStyles.textBase}>No recent transactions</Text>
    </View>
  );
};

const formatDate = (dateString: string): string => {
  const date = parseISO(dateString);

  if (isToday(date)) {
    return 'Today';
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  if (isTomorrow(date)) {
    return 'Tomorrow';
  }
  return format(date, 'MMMM d, yyyy');
};

export default function Transactions() {
  const { transactions } = useParentContext()?.appState ?? {};
  const groupedTransactions = getGroupedTransactionsByDate(transactions);

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

  return (
    <View style={commonStyles.container}>
      <SectionList
        style={commonStyles.list}
        sections={groupedTransactions}
        ItemSeparatorComponent={separator}
        renderSectionHeader={({ section: { title: date } }) => (
          <SectionHeader title={formatDate(date)} />
        )}
        renderItem={({ item }) => <TransactionComponent transaction={item} />}
        ListEmptyComponent={renderNoStateMessage()}
      />
    </View>
  );
}

// import React from 'react';
// import { FlatList, Text, View, StyleSheet } from 'react-native';
// import BrandingColours from '../styles/brandingConstants';

// interface Transaction {
//   id: string;
//   name: string;
//   amount: number;
//   account: string;
//   date: string;
//   category: string;
//   status: 'reviewed' | 'pending' | 'completed';
//   split: boolean;
//   grouped: boolean;
// }

// const transactions: Transaction[] = [
//   {
//     id: '1',
//     name: 'Grocery Shopping',
//     amount: -54.23,
//     account: 'Credit Card',
//     date: '2024-06-01',
//     category: 'Groceries',
//     status: 'reviewed',
//     split: false,
//     grouped: false,
//   },
//   {
//     id: '2',
//     name: 'Electric Bill',
//     amount: -75.00,
//     account: 'Bank Account',
//     date: '2024-06-02',
//     category: 'Utilities',
//     status: 'pending',
//     split: true,
//     grouped: false,
//   },
//   {
//     id: '3',
//     name: 'Refund',
//     amount: 30.50,
//     account: 'Credit Card',
//     date: '2024-06-02',
//     category: 'Income',
//     status: 'completed',
//     split: false,
//     grouped: true,
//   },
//   // Add more transactions as needed
// ];

// const groupTransactionsByDate = (transactions: Transaction[]) => {
//   return transactions.reduce((groups, transaction) => {
//     const date = transaction.date;
//     if (!groups[date]) {
//       groups[date] = [];
//     }
//     groups[date].push(transaction);
//     return groups;
//   }, {} as Record<string, Transaction[]>);
// };

// const TransactionsScreen: React.FC = () => {
//   const groupedTransactions = groupTransactionsByDate(transactions);

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={Object.keys(groupedTransactions)}
//         renderItem={({ item: date }) => (
//           <View style={styles.dateGroup}>
//             <Text style={styles.dateHeader}>{date}</Text>
//             {groupedTransactions[date].map((transaction) => (
//               <View key={transaction.id} style={styles.transactionCard}>
//                 <View style={styles.transactionHeader}>
//                   <Text style={styles.transactionName}>{transaction.name}</Text>
//                   {transaction.split && <Text style={styles.splitLabel}>Split</Text>}
//                   {transaction.grouped && <Text style={styles.groupedLabel}>Grouped</Text>}
//                   <Text
//                     style={[
//                       styles.transactionAmount,
//                       { color: transaction.amount < 0 ? '#ff6347' : '#34C759' },
//                     ]}
//                   >
//                     {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
//                   </Text>
//                 </View>
//                 <View style={styles.transactionDetails}>
//                   <Text style={styles.transactionInfo}>{transaction.account}</Text>
//                   <Text style={styles.category}>{transaction.category}</Text>
//                   <Text style={[styles.status, styles[`status_${transaction.status}`]]}>{transaction.status}</Text>
//                 </View>
//               </View>
//             ))}
//           </View>
//         )}
//         keyExtractor={(item) => item}
//       />
//     </View>
//   );
// };

// export default TransactionsScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: BrandingColours.backgroundColour,
//   },
//   dateGroup: {
//     marginBottom: 10,
//   },
//   dateHeader: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//   },
//   transactionCard: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//     marginHorizontal: 10,
//   },
//   transactionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 5,
//   },
//   transactionName: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#333',
//     flex: 1,
//   },
//   splitLabel: {
//     fontSize: 12,
//     color: '#ff6347',
//     marginLeft: 5,
//     backgroundColor: '#ffe4e1',
//     paddingHorizontal: 5,
//     borderRadius: 3,
//   },
//   groupedLabel: {
//     fontSize: 12,
//     color: '#007AFF',
//     marginLeft: 5,
//     backgroundColor: '#e0f7ff',
//     paddingHorizontal: 5,
//     borderRadius: 3,
//   },
//   transactionAmount: {
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   transactionDetails: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   transactionInfo: {
//     fontSize: 12,
//     color: '#666',
//     flex: 1,
//   },
//   category: {
//     fontSize: 12,
//     color: '#007AFF',
//     marginLeft: 10,
//   },
//   status: {
//     fontSize: 12,
//     marginLeft: 10,
//   },
//   status_reviewed: {
//     color: '#34C759',
//   },
//   status_pending: {
//     color: '#FF9500',
//   },
//   status_completed: {
//     color: '#9e9e9e',
//   },
// });
