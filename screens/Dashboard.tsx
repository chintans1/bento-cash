import React, { useEffect, useMemo, useState } from 'react';
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
import InternalLunchMoneyClient from '../clients/lunchMoneyClient';
import { getBudgetSummary } from '../data/transformLunchMoney';
import { BudgetSummary } from '../models/lunchmoney/appModels';
import { endOfMonth, startOfMonth } from 'date-fns';
import BudgetOverviewCard from '../components/BudgetOverviewCard';

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

  // new styles incoming
  budgetCard: {
    backgroundColor: NewBrandingColours.neutral.white,
    borderRadius: 12,
    padding: 16,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  budgetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: NewBrandingColours.text.primary,
  },
  budgetAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: NewBrandingColours.text.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: NewBrandingColours.neutral.lightGray,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  categoryCard: {
    width: '50%',
    padding: 8,
  },
  categoryContent: {
    backgroundColor: NewBrandingColours.neutral.white,
    borderRadius: 12,
    padding: 12,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: NewBrandingColours.text.primary,
    marginBottom: 4,
  },
  categoryAmount: {
    fontSize: 12,
    color: NewBrandingColours.text.secondary,
  },
});

type SectionType = 'balance' | 'accounts' | 'transactions' | 'budget';

interface SectionItem {
  type: SectionType;
}

export default function Dashboard({ navigation }) {
  const { lmApiKey, transactions, accounts: accountsMap } = useParentContext()?.appState ?? {};

  const lunchMoneyClient = useMemo(
    () => new InternalLunchMoneyClient({ token: lmApiKey }),
    [lmApiKey]
  );

  // const renderCategoryGrid = () => (
  //   <View style={styles.categoryGrid}>
  //     {Object.entries(categorySpending).map(([category, amount]) => (
  //       <View key={category} style={styles.categoryCard}>
  //         <View style={styles.categoryContent}>
  //           <View
  //             style={[
  //               styles.categoryIcon,
  //               { backgroundColor: NewBrandingColours.primary.main },
  //             ]}
  //           >
  //             <Icon name="box" size={16} color={NewBrandingColours.neutral.white} />
  //           </View>
  //           <Text style={styles.categoryName}>{category}</Text>
  //           <Text style={styles.categoryAmount}>${amount.toLocaleString()}</Text>
  //         </View>
  //       </View>
  //     ))}
  //   </View>
  // );

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

  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary>(null);
  const [isLoadingBudget, setIsLoadingBudget] = useState(true);

  const fetchBudgetData = async () => {
    try {
      setBudgetSummary(await getBudgetSummary(lunchMoneyClient, startOfMonth(new Date()), endOfMonth(new Date())));
    } catch (error) {
      console.error('Error fetching budget:', error);
    } finally {
      setIsLoadingBudget(false);
    }
  };

  useEffect(() => {
    fetchBudgetData();
  }, []);

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
      case 'budget':
        // TODO: need to be styling this better, let's focus on showing a small glimpse of the budget
        // In the future, there should be a budget screen with more details
        return <BudgetOverviewCard
          expectedIncome={budgetSummary?.expectedIncome}
          actualIncome={budgetSummary?.actualIncome}
          expectedExpenses={budgetSummary?.expectedExpenses}
          actualExpenses={budgetSummary?.actualExpenses}
        />
          // <View style={styles.sectionCard}>
            {/* <Text style={styles.sectionTitle}>Monthly Budget</Text> */}
          {/* </View> */}

      default:
        return null;
    }
  };

  const sections: SectionItem[] = [
    { type: 'balance' },
    { type: 'budget'},
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
