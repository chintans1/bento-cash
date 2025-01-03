import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { NewBrandingColours } from '../styles/brandingConstants';
import { useParentContext } from '../context/app/appContextProvider';
import InternalLunchMoneyClient from '../clients/lunchMoneyClient';
import { AppTransaction } from '../models/lunchmoney/appModels';
import { getTransactionsForWholeYear } from '../data/transformLunchMoney';
import ChartSection from '../components/charts/ChartSection';
import Icon from 'react-native-vector-icons/Feather';
import { subMonths, startOfMonth, startOfYear } from 'date-fns';
import { allMonths, endOfMonthUTC, getMonthNames, startOfMonthUTC } from '../utils/dateUtils';

type Period = 'month' | 'quarter' | 'ytd' | 'year';
type PeriodLabel = '1M' | '3M' | 'YTD' | '1Y';

const periodLabels: Record<Period, PeriodLabel> = {
  month: '1M',
  quarter: '3M',
  ytd: 'YTD',
  year: '1Y',
};

const chartContainerPadding = 16;

interface MonthlyData {
  month: string;
  netIncome: number;
  income: number;
  spending: number;
};

interface ChartData {
  relevantMonths: string[];
  totalNetIncome: number;
  totalSpend: number;
  totalIncome: number;
  netIncome: number[];
  income: number[];
  spend: number[];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NewBrandingColours.neutral.background,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: NewBrandingColours.text.primary,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: NewBrandingColours.text.secondary,
  },
  summaryContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
    marginHorizontal: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: NewBrandingColours.neutral.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: NewBrandingColours.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryLabel: {
    fontSize: 14,
    color: NewBrandingColours.text.secondary,
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: '600',
    color: NewBrandingColours.text.primary,
    marginBottom: 4,
  },
  summaryChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changePositive: {
    color: NewBrandingColours.secondary.main,
  },
  changeNegative: {
    color: NewBrandingColours.accent.red,
  },
  changeText: {
    fontSize: 12,
    marginLeft: 4,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: NewBrandingColours.neutral.lightGray,
    borderRadius: 8,
    marginHorizontal: 16,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  periodButtonActive: {
    backgroundColor: NewBrandingColours.neutral.white,
  },
  periodButtonText: {
    fontSize: 14,
    color: NewBrandingColours.text.secondary,
  },
  periodButtonTextActive: {
    color: NewBrandingColours.text.primary,
    fontWeight: '600',
  },
  chartCard: {
    backgroundColor: NewBrandingColours.neutral.white,
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: NewBrandingColours.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: NewBrandingColours.text.primary,
    marginBottom: 8,
  },
  chartSubtitle: {
    fontSize: 14,
    color: NewBrandingColours.text.secondary,
    marginBottom: 16,
  },
});

export default function ChartsScreen() {
  const { appState: { lmApiKey, categories } } = useParentContext();

  const [selectedPeriod, setSelectedPeriod] = useState<Period>('ytd');
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartData>({
    relevantMonths: [],
    totalNetIncome: 0,
    totalSpend: 0,
    totalIncome: 0,
    netIncome: [],
    income: [],
    spend: [],
  });

  const lunchMoneyClient = useMemo(
    () => new InternalLunchMoneyClient({ token: lmApiKey }),
    [lmApiKey],
  );

  const getDateRange = (period: Period) => {
    const endDate = new Date();
    let startDate: Date;

    switch (period) {
      case 'month':
        startDate = startOfMonth(endDate);
        break;
      case 'quarter':
        startDate = subMonths(endDate, 2);
        break;
      case 'ytd':
        startDate = startOfYear(endDate);
        break;
      case 'year':
        startDate = subMonths(endDate, 11);
        break;
      default:
        startDate = subMonths(endDate, 12);
    }

    return { startDate: startOfMonthUTC(startDate), endDate: endOfMonthUTC(endDate) };
  };

  const processTransactionsByMonth = useCallback((
    transactions: AppTransaction[],
    period: Period,
  ): ChartData => {
    const { startDate, endDate } = getDateRange(period);

    const filteredTransactions = transactions.filter(
      t => new Date(t.date) >= startDate && new Date(t.date) <= endDate
    );

    const relevantMonths = getMonthNames(startDate, endDate);

    // Initialize data structure for all months
    const monthlyData: MonthlyData[] = relevantMonths.map(month => ({
      month: month,
      netIncome: 0,
      income: 0,
      spending: 0,
    }));

    const totals = filteredTransactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const monthIndex = monthlyData.findIndex(m => m.month === allMonths[date.getUTCMonth()]);
      if (monthIndex === -1) return acc;

      const amount = parseFloat(transaction.amount);
      const monthData = monthlyData[monthIndex];

      if (amount > 0) {
        monthData.income += amount;
        monthData.netIncome += amount;
        acc.totalIncome += amount;
      } else {
        monthData.spending += Math.abs(amount);
        monthData.netIncome -= Math.abs(amount);
        acc.totalSpend += Math.abs(amount);
      }

      return acc;
    }, { totalSpend: 0, totalIncome: 0 });

    return {
      ...totals,
      relevantMonths: relevantMonths,
      totalNetIncome: totals.totalIncome - totals.totalSpend,
      netIncome: monthlyData.map(m => m.netIncome),
      income: monthlyData.map(m => m.income),
      spend: monthlyData.map(m => m.spending),
    };
  }, []);

  const renderSummaryCard = (title: string, amount: number, change: number) => (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryLabel}>{title}</Text>
      <Text style={styles.summaryAmount}>${Math.abs(amount).toLocaleString()}</Text>
      <View style={styles.summaryChange}>
        <Icon
          name={change >= 0 ? 'arrow-up-right' : 'arrow-down-right'}
          size={12}
          color={change >= 0 ? NewBrandingColours.secondary.main : NewBrandingColours.accent.red}
        />
        <Text
          style={[
            styles.changeText,
            change >= 0 ? styles.changePositive : styles.changeNegative,
          ]}
        >
          {Math.abs(change)}%
        </Text>
      </View>
    </View>
  );

  useEffect(() => {
    const fetchAndProcessTransactions = async () => {
      try {
        setIsLoading(true);

        const transactions = await getTransactionsForWholeYear(
          lunchMoneyClient,
          new Map(categories.map(category => [category.id, category])),
        );

        const processedData = processTransactionsByMonth(transactions, selectedPeriod);
        setChartData(processedData);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndProcessTransactions();
  }, [lunchMoneyClient, categories, processTransactionsByMonth, selectedPeriod]);

  const chartConfig = useMemo(() => ({
    income: {
      labels: chartData.relevantMonths,
      datasets: [{
        id: 'income',
        data: chartData.income,
        color: () => NewBrandingColours.secondary.main,
        negativeColor: () => NewBrandingColours.accent.red,
      }],
    },
    netIncome: {
      labels: chartData.relevantMonths,
      datasets: [{
        id: 'netIncome',
        data: chartData.netIncome,
        color: () => NewBrandingColours.secondary.main,
        negativeColor: () => NewBrandingColours.accent.red,
      }],
      },
  }), [chartData]);

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={NewBrandingColours.primary.main} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Financial Overview</Text>
        <Text style={styles.headerSubtitle}>Track your income and spending</Text>
      </View>
      <View style={styles.summaryContainer}>
        {renderSummaryCard('Total Income', chartData.totalIncome, 12.5)}
        {renderSummaryCard('Total Expenses', chartData.totalSpend, -8.3)}
      </View>
      <View style={styles.periodSelector}>
        {(Object.keys(periodLabels) as Period[]).map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.periodButtonTextActive,
              ]}
            >
              {periodLabels[period]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ChartSection
          title="Income"
          subtitle="Monthly income breakdown"
          data={chartConfig.income}
          padding={chartContainerPadding}
        />
        <ChartSection
          title="Net income"
          subtitle="Income minus expenses"
          data={chartConfig.netIncome}
          padding={chartContainerPadding}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
