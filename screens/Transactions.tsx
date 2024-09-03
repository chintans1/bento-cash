import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useParentContext } from '../context/app/appContextProvider';
import { NewBrandingColours } from '../styles/brandingConstants';
import TransactionComponent from '../components/Transaction';
import commonStyles from '../styles/commonStyles';

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: NewBrandingColours.neutral.white,
    // borderBottomWidth: 1,
    // borderBottomColor: NewBrandingColours.neutral.lightGray,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: NewBrandingColours.text.primary,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    backgroundColor: NewBrandingColours.neutral.lightGray,
  },
  sortLabel: {
    fontSize: 16,
    color: NewBrandingColours.text.secondary,
    // marginRight: 8,
  },
  sortButtonsContainer: {
    flexDirection: 'row',
  },
  sortButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginLeft: 8,
    backgroundColor: NewBrandingColours.neutral.lightGray,
  },
  sortButtonActive: {
    backgroundColor: NewBrandingColours.primary.main,
  },
  sortButtonText: {
    fontSize: 14,
    color: NewBrandingColours.text.secondary,
  },
  sortButtonTextActive: {
    color: NewBrandingColours.neutral.white,
  },
  transactionList: {
    paddingHorizontal: 16,
  },
});

export default function TransactionsScreen() {
  const { transactions } = useParentContext()?.appState ?? {};
  const [sortBy, setSortBy] = useState('date'); // 'date' or 'amount'

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortBy === 'date') {
      return 1;
    }
    return Math.abs(parseFloat(b.amount)) - Math.abs(parseFloat(a.amount));
  });

  return (
    <View style={styles.container}>
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <View style={styles.sortButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === 'date' && styles.sortButtonActive,
            ]}
            onPress={() => setSortBy('date')}
          >
            <Text
              style={[
                styles.sortButtonText,
                sortBy === 'date' && styles.sortButtonTextActive,
              ]}
            >
              Date
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === 'amount' && styles.sortButtonActive,
            ]}
            onPress={() => setSortBy('amount')}
          >
            <Text
              style={[
                styles.sortButtonText,
                sortBy === 'amount' && styles.sortButtonTextActive,
              ]}
            >
              Amount
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={sortedTransactions}
        renderItem={({ item }) => <TransactionComponent transaction={item} />}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.transactionList}
      />
    </View>
  );
}
