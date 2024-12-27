import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { NewBrandingColours } from '../styles/brandingConstants';
import { useParentContext } from '../context/app/appContextProvider';
import InternalLunchMoneyClient from '../clients/lunchMoneyClient';
import { AppTransaction } from '../models/lunchmoney/appModels';
import { getTransactionsForWholeYear } from '../data/transformLunchMoney';
import ChartSection from '../components/charts/ChartSection';

const months = Array.from({ length: 12 }, (_, i) => {
  return {
    month: new Date(2024, i).toLocaleString('default', { month: 'short' }),
  };
});
const monthLabels = months.map(month => month.month);
const screenWidth = Dimensions.get('window').width;
const chartContainerPadding = 16;

interface MonthlyData {
  month: string;
  netIncome: number;
  income: number;
  spending: number;
};

interface ChartData {
  totalNetIncome: number;
  totalSpend: number;
  totalIncome: number;
  netIncome: number[];
  income: number[];
  spend: number[];
}

const chartStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NewBrandingColours.neutral.background,
  },
  scrollContent: {
    padding: chartContainerPadding,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: NewBrandingColours.text.primary,
    marginBottom: 20,
  },
  chartContainer: {
    backgroundColor: NewBrandingColours.neutral.white,
    borderRadius: 12,
    marginBottom: 20,
    padding: chartContainerPadding,
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
    marginBottom: 10,
  },
});

export default function ChartsScreen() {
  const { appState: { lmApiKey, categories } } = useParentContext();

  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartData>({
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

  const processTransactionsByMonth = useCallback((
    transactions: AppTransaction[],
  ): ChartData => {
    // Initialize data structure for all months
    const monthlyData: MonthlyData[] = months.map(month => ({
      month: month.month,
      netIncome: 0,
      income: 0,
      spending: 0,
    }));

    const totals = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const monthIndex = date.getMonth();
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
      totalNetIncome: totals.totalIncome - totals.totalSpend,
      netIncome: monthlyData.map(m => m.netIncome),
      income: monthlyData.map(m => m.income),
      spend: monthlyData.map(m => m.spending),
    };
  }, []);

  useEffect(() => {
    const fetchAndProcessTransactions = async () => {
      try {
        setIsLoading(true);

        const transactions = await getTransactionsForWholeYear(
          lunchMoneyClient,
          new Map(categories.map(category => [category.id, category])),
        );

        const processedData = processTransactionsByMonth(transactions);
        setChartData(processedData);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndProcessTransactions();
  }, [lunchMoneyClient, categories, processTransactionsByMonth]);

  const chartConfig = useMemo(() => ({
    income: {
      labels: monthLabels,
      datasets: [{
        id: 'income',
        data: chartData.income,
        color: () => NewBrandingColours.secondary.main,
        negativeColor: () => NewBrandingColours.accent.red,
      }],
    },
    netIncome: {
      labels: monthLabels,
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
      <View style={chartStyles.loadingContainer}>
        <ActivityIndicator size="large" color={NewBrandingColours.primary.main} />
      </View>
    );
  }

  return (
    <SafeAreaView style={chartStyles.container}>
      <ScrollView contentContainerStyle={chartStyles.scrollContent}>
        <ChartSection
          title="Income"
          data={chartConfig.income}
          padding={chartContainerPadding}
        />
        <ChartSection
          title="Net income"
          data={chartConfig.netIncome}
          padding={chartContainerPadding}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
