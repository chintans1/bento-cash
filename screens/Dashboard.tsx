import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useParentContext } from '../context/app/appContextProvider';
import { AccountSummary } from '../models/bento/accountSummary';
import { getAccountsSummary } from '../data/transformAccounts';
import { NewBrandingColours } from '../styles/brandingConstants';
import commonStyles from '../styles/commonStyles';
import AccountSummaryItem from '../components/summary/AccountSummaryItem';
import TransactionSummaryItem from '../components/summary/TransactionSummaryItem';
import { formatAmountString } from '../data/formatBalance';
import renderNoStateMessage from '../components/EmptyListComponent';

const styles = StyleSheet.create({
  balanceCard: {
    ...commonStyles.card,
    backgroundColor: NewBrandingColours.primary.main,
  },
  balanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: NewBrandingColours.neutral.white,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: NewBrandingColours.neutral.white,
  },
  balanceChange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  balanceChangeText: {
    marginLeft: 4,
    fontSize: 14,
    color: NewBrandingColours.secondary.light,
    fontWeight: '500',
  },
  sectionCard: {
    ...commonStyles.card,
    padding: 0,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: NewBrandingColours.text.primary,
    padding: 16,
  },

  // Common view more button style
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  viewMoreText: {
    marginRight: 4,
    fontSize: 16,
    fontWeight: '600',
    color: NewBrandingColours.primary.main,
  },
});

type SectionType = 'balance' | 'accounts' | 'transactions';

interface SectionItem {
  type: SectionType;
}

export default function Dashboard({ navigation }) {
  const { transactions, accounts: accountsMap } =
    useParentContext()?.appState ?? {};
  const recentTransactions =
    transactions.length > 3 ? transactions.slice(0, 3) : transactions;

  const accounts: AccountSummary[] = useMemo(
    () => getAccountsSummary(accountsMap),
    [accountsMap],
  );

  const netWorth = useMemo(() => {
    return accounts
      .map(account => account.balance)
      .reduce((partialNw, balance) => partialNw + balance, 0);
  }, [accounts]);
  const netWorthString = useMemo(
    () => formatAmountString(netWorth),
    [netWorth],
  );

  const viewMoreButton = (
    viewText: string,
    navigationPath: string,
  ): JSX.Element => {
    return (
      <TouchableOpacity
        style={styles.viewMoreButton}
        onPress={() => navigation.navigate(navigationPath)}
      >
        <Text style={styles.viewMoreText}>{viewText}</Text>
        <Icon
          name="chevron-right"
          size={20}
          color={NewBrandingColours.primary.main}
        />
      </TouchableOpacity>
    );
  };

  const renderSection = (section: SectionItem) => {
    switch (section.type) {
      case 'balance':
        return (
          <View style={styles.balanceCard}>
            <Text style={styles.balanceTitle}>Net Worth</Text>
            <Text style={styles.balanceAmount}>{netWorthString}</Text>
            {/* <View style={styles.balanceChange}>
              <Icon
                name="arrow-up-right"
                size={16}
                color={NewBrandingColours.secondary.main}
              />
              <Text style={styles.balanceChangeText}>
                +2.5% from last month
              </Text>
            </View> */}
          </View>
        );
      case 'accounts':
        return (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Accounts Summary</Text>
            <FlatList
              data={accounts}
              renderItem={({ item }) => (
                <AccountSummaryItem accountSummary={item} showTrend={false} />
              )}
              ListEmptyComponent={renderNoStateMessage('No accounts found')}
            />
            {viewMoreButton('View Accounts', 'Accounts')}
          </View>
        );
      // TODO: need to be rendering it closer to Transactions screen
      case 'transactions':
        return (
          <View style={[styles.sectionCard, { marginBottom: 16 }]}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <FlatList
              data={recentTransactions}
              renderItem={({ item }) => (
                <TransactionSummaryItem transaction={item} />
              )}
              ListEmptyComponent={renderNoStateMessage('No transactions found')}
            />
            {viewMoreButton('View All Transactions', 'Transactions')}
          </View>
        );
      default:
        return null;
    }
  };

  const sections: SectionItem[] = [
    { type: 'balance' },
    { type: 'accounts' },
    { type: 'transactions' },
  ];

  return (
    <FlatList
      data={sections}
      renderItem={({ item }) => renderSection(item)}
      keyExtractor={item => item.type}
    />
  );
}
