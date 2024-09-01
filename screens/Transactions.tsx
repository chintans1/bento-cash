import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useParentContext } from '../context/app/appContextProvider';
import { AppTransaction } from '../models/lunchmoney/appModels';
import { formatAmountString } from '../data/formatBalance';
import { NewBrandingColours } from '../styles/brandingConstants';

function getCategoryIcon(category) {
  switch (category?.toLowerCase()) {
    case 'food':
      return 'coffee';
    case 'transportation':
      return 'truck';
    case 'income':
      return 'dollar-sign';
    case 'utilities':
      return 'zap';
    case 'shopping':
      return 'shopping-bag';
    case 'entertainment':
      return 'film';
    case 'health':
      return 'heart';
    default:
      return 'circle';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NewBrandingColours.neutral.background,
    paddingTop: StatusBar.currentHeight,
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
    padding: 16,
    backgroundColor: NewBrandingColours.neutral.white,
    // borderBottomWidth: 1,
    // borderBottomColor: NewBrandingColours.neutral.lightGray,
  },
  sortLabel: {
    fontSize: 16,
    color: NewBrandingColours.text.secondary,
    marginRight: 8,
  },
  sortButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginHorizontal: 4,
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
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: NewBrandingColours.neutral.lightGray,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    // backgroundColor: NewBrandingColours.neutral.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '500',
    color: NewBrandingColours.text.primary,
  },
  transactionDate: {
    fontSize: 14,
    color: NewBrandingColours.text.muted,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
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

  // TODO: better mapping
  const getCategoryColor = (): string => {
    const accentColors = Object.values(NewBrandingColours.accent);
    const randomIndex = Math.floor(Math.random() * accentColors.length);
    return accentColors[randomIndex];
  };

  const renderTransaction = (transaction: AppTransaction) => (
    <TouchableOpacity style={styles.transactionItem}>
      <View
        style={[
          styles.transactionIcon,
          { backgroundColor: getCategoryColor() },
        ]}
      >
        <Icon
          name={getCategoryIcon(transaction.categoryName)}
          size={20}
          color={NewBrandingColours.neutral.white}
        />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionName}>{transaction.payee}</Text>
        <Text style={styles.transactionDate}>{transaction.date}</Text>
      </View>
      <Text
        style={[
          styles.transactionAmount,
          {
            color:
              parseFloat(transaction.amount) >= 0
                ? NewBrandingColours.secondary.main
                : NewBrandingColours.accent.red,
          },
        ]}
      >
        {formatAmountString(transaction.amount)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#4A5568" />
        </TouchableOpacity>
         <Text style={styles.headerTitle}>Transactions</Text>
        <TouchableOpacity onPress={() => {}}>
          <Icon name="filter" size={24} color="#4A5568" />
        </TouchableOpacity>
      </View> */}

      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
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

      <FlatList
        data={sortedTransactions}
        renderItem={({ item }) => renderTransaction(item)}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.transactionList}
      />
    </View>
  );
}
