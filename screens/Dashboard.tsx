import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
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
import BudgetOverviewCard from '../components/BudgetOverviewCard';
import { endOfMonthUTC, startOfMonthUTC } from '../utils/dateUtils';
import LineChart from '../components/charts/LineChart';
import StackedBarChart from '../components/charts/StackedBarChart';
import BarChart from '../components/charts/BarChart';
import CategoryBudgetCard from '../components/CategoryBudgetCard';
import {
  getSpendingComparisonData,
  getCashFlowData,
  getTopExpenseCategories,
} from '../data/transformChartData';

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
  chartCard: {
    ...commonStyles.card,
    marginTop: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: NewBrandingColours.text.primary,
  },
  chartSubtitle: {
    fontSize: 12,
    color: NewBrandingColours.text.muted,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: NewBrandingColours.text.secondary,
  },
  categoriesGrid: {
    marginTop: 16,
  },
});

type SectionType =
  | 'balance'
  | 'accounts'
  | 'transactions'
  | 'budget'
  | 'spendingTrends'
  | 'cashFlow'
  | 'topCategories'
  | 'categoryBudgets';

interface SectionItem {
  type: SectionType;
  render: () => ReactElement;
}

export default function Dashboard({ navigation }) {
  const {
    lmApiKey,
    transactions,
    accounts: accountsMap,
    categories: categoriesArray,
  } = useParentContext()?.appState ?? {};

  const lunchMoneyClient = useMemo(
    () => new InternalLunchMoneyClient({ token: lmApiKey }),
    [lmApiKey],
  );

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
    () => formatAmountString(netWorth, 'USD'),
    [netWorth],
  );

  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary>(null);

  const fetchBudgetData = useCallback(async () => {
    try {
      setBudgetSummary(
        await getBudgetSummary(
          lunchMoneyClient,
          startOfMonthUTC(new Date()),
          endOfMonthUTC(new Date()),
        ),
      );
    } catch (error) {
      console.error('Error fetching budget:', error);
    }
  }, [lunchMoneyClient]);

  useEffect(() => {
    fetchBudgetData();
  }, [fetchBudgetData]);

  // Convert categories array to map
  const categoriesMap = useMemo(() => {
    const map = new Map();
    categoriesArray?.forEach(cat => map.set(cat.id, cat));
    return map;
  }, [categoriesArray]);

  // Calculate chart data
  const spendingComparisonData = useMemo(
    () => getSpendingComparisonData(transactions || []),
    [transactions],
  );

  const cashFlowData = useMemo(
    () => getCashFlowData(transactions || [], 6),
    [transactions],
  );

  const topCategories = useMemo(
    () => getTopExpenseCategories(transactions || [], categoriesMap, 5),
    [transactions, categoriesMap],
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

  const renderBalanceCard = () => (
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

  const renderAccountsCard = () => (
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

  const renderTransactionsCard = () => (
    <View style={[styles.sectionCard, { marginBottom: 16 }]}>
      <Text style={styles.sectionTitle}>Recent Transactions</Text>
      <FlatList
        data={recentTransactions}
        renderItem={({ item }) => <TransactionSummaryItem transaction={item} />}
        ListEmptyComponent={renderNoStateMessage('No transactions found')}
      />
      {viewMoreButton('View All Transactions', 'Transactions')}
    </View>
  );

  const renderBudgetCard = () => (
    <BudgetOverviewCard
      expectedIncome={budgetSummary?.expectedIncome}
      actualIncome={budgetSummary?.actualIncome}
      expectedExpenses={budgetSummary?.expectedExpenses}
      actualExpenses={budgetSummary?.actualExpenses}
    />
  );

  const renderSpendingTrendsChart = () => (
    <View style={styles.chartCard}>
      <View style={styles.chartHeader}>
        <View>
          <Text style={styles.chartTitle}>Spending Trends</Text>
          <Text style={styles.chartSubtitle}>This month vs. last month</Text>
        </View>
      </View>
      <LineChart
        data={{
          labels: spendingComparisonData.labels,
          datasets: [
            {
              data: spendingComparisonData.lastMonth,
              color: NewBrandingColours.neutral.gray,
              label: 'Last Month',
            },
            {
              data: spendingComparisonData.thisMonth,
              color: NewBrandingColours.secondary.main,
              label: 'This Month',
            },
          ],
        }}
        showDots={true}
      />
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              { backgroundColor: NewBrandingColours.neutral.gray },
            ]}
          />
          <Text style={styles.legendText}>Last Month</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              { backgroundColor: NewBrandingColours.secondary.main },
            ]}
          />
          <Text style={styles.legendText}>This Month</Text>
        </View>
      </View>
    </View>
  );

  const renderCashFlowChart = () => (
    <View style={styles.chartCard}>
      <View style={styles.chartHeader}>
        <View>
          <Text style={styles.chartTitle}>Cash Flow Trends</Text>
          <Text style={styles.chartSubtitle}>Last 6 months</Text>
        </View>
      </View>
      <StackedBarChart
        data={{
          labels: cashFlowData.labels,
          datasets: [
            {
              data: cashFlowData.expenses,
              color: NewBrandingColours.accent.red,
              label: 'Expenses',
            },
            {
              data: cashFlowData.income,
              color: NewBrandingColours.secondary.main,
              label: 'Income',
            },
          ],
        }}
        stacked={false}
      />
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              { backgroundColor: NewBrandingColours.secondary.main },
            ]}
          />
          <Text style={styles.legendText}>Income</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              { backgroundColor: NewBrandingColours.accent.red },
            ]}
          />
          <Text style={styles.legendText}>Expenses</Text>
        </View>
      </View>
    </View>
  );

  const renderTopCategoriesChart = () => (
    <View style={styles.chartCard}>
      <View style={styles.chartHeader}>
        <View>
          <Text style={styles.chartTitle}>Top Expense Categories</Text>
          <Text style={styles.chartSubtitle}>Current month</Text>
        </View>
      </View>
      {topCategories.length > 0 ? (
        <BarChart
          data={{
            labels: topCategories.map(cat => cat.categoryName.slice(0, 8)),
            datasets: [
              {
                data: topCategories.map(cat => cat.amount),
                color: () => NewBrandingColours.primary.main,
                negativeColor: () => NewBrandingColours.accent.red,
              },
            ],
          }}
        />
      ) : (
        <Text style={styles.chartSubtitle}>
          No expense data available for this month
        </Text>
      )}
    </View>
  );

  const renderCategoryBudgets = () => (
    <View style={styles.categoriesGrid}>
      {topCategories.slice(0, 3).map((category, index) => {
        // Mock budget data - in production, fetch real budget data
        const mockBudget = category.amount * 1.2;
        return (
          <CategoryBudgetCard
            key={`category-${index}`}
            categoryName={category.categoryName}
            budget={mockBudget}
            actual={category.amount}
            color={category.color}
          />
        );
      })}
    </View>
  );

  const sections: SectionItem[] = [
    { type: 'balance', render: renderBalanceCard },
    { type: 'spendingTrends', render: renderSpendingTrendsChart },
    { type: 'cashFlow', render: renderCashFlowChart },
    { type: 'budget', render: renderBudgetCard },
    { type: 'topCategories', render: renderTopCategoriesChart },
    { type: 'categoryBudgets', render: renderCategoryBudgets },
    { type: 'accounts', render: renderAccountsCard },
    { type: 'transactions', render: renderTransactionsCard },
  ];

  return (
    <FlatList
      data={sections}
      renderItem={({ item }) => item.render()}
      keyExtractor={item => item.type}
    />
  );
}
