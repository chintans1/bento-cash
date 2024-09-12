import axios from 'axios';
import { Network } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';

const colors = {
  primary: { main: '#1A73E8', light: '#4285F4', dark: '#0D47A1' },
  secondary: { main: '#00C853', light: '#69F0AE', dark: '#009624' },
  accent: { purple: '#7C4DFF', orange: '#FF6D00', red: '#FF3D00', yellow: '#FFD600' },
  neutral: { white: '#FFFFFF', background: '#F5F5F5', lightGray: '#E0E0E0', gray: '#9E9E9E', darkGray: '#616161', black: '#212121' },
  text: { primary: '#212121', secondary: '#424242', muted: '#757575' },
};

const screenWidth = Dimensions.get('window').width;

const API_KEY = '9cc0bd5893da14da541276200cadd360bf95a62887f6913ee1';
const BASE_URL = 'https://dev.lunchmoney.app/v1';

export default function Charts() {
  const [netWorthData, setNetWorthData] = useState([]);
  const [spendingData, setSpendingData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetsResponse, transactionsResponse] = await Promise.all([
          axios.get(`${BASE_URL}/assets`, {
            headers: { Authorization: `Bearer ${API_KEY}` }
          }),
          axios.get(`${BASE_URL}/transactions`, {
            headers: { Authorization: `Bearer ${API_KEY}` },
            params: {
              start_date: '2024-01-01',
              end_date: '2024-12-31'
            }
          })
        ]);

        // Process net worth data
        const netWorth = assetsResponse.data.assets.reduce((total, asset) => total + parseFloat(asset.balance), 0);
        setNetWorthData([
          { month: 'Jan', value: netWorth * 0.9 },
          { month: 'Feb', value: netWorth * 0.95 },
          { month: 'Mar', value: netWorth * 0.97 },
          { month: 'Apr', value: netWorth * 1.02 },
          { month: 'May', value: netWorth * 1.05 },
          { month: 'Jun', value: netWorth},
        ]);

        // Process spending data
        const spending = transactionsResponse.data.transactions.filter(t => parseFloat(t.amount) < 0);
        // console.log(spending);
        const thisMonth = spending.filter(t => t.date.startsWith('2024-09')).reduce((total, t) => total + Math.abs(parseFloat(t.amount)), 0);
        const lastMonth = spending.filter(t => t.date.startsWith('2024-08')).reduce((total, t) => total + Math.abs(parseFloat(t.amount)), 0);
        setSpendingData([
          { month: 'Last Month', amount: lastMonth },
          { month: 'This Month', amount: thisMonth },
        ]);

        // Process income data
        const income = transactionsResponse.data.transactions.filter(t => parseFloat(t.amount) > 0);
        // console.log(income);
        const thisMonthIncome = income.filter(t => t.date.startsWith('2024-09')).reduce((total, t) => total + parseFloat(t.amount), 0);
        const lastMonthIncome = income.filter(t => t.date.startsWith('2024-08')).reduce((total, t) => total + parseFloat(t.amount), 0);

        setIncomeData([
          { month: 'Last Month', amount: lastMonthIncome },
          { month: 'This Month', amount: thisMonthIncome },
        ]);

        setIsLoading(false);

        // console.log(netWorthData);
        // console.log(spendingData);
        // console.log(incomeData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Financial Overview</Text>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Net Worth Trend</Text>
          <LineChart
            data={{
              labels: netWorthData.map(d => d.month),
              datasets: [{ data: netWorthData.map(d => d.value) }]
            }}
            width={350}
            height={220}
            yAxisLabel="$"
            chartConfig={{
              backgroundColor: colors.neutral.white,
              backgroundGradientFrom: colors.neutral.white,
              backgroundGradientTo: colors.neutral.white,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(26, 115, 232, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: colors.primary.main
              }
            }}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Spending Comparison</Text>
          <BarChart
            data={{
              labels: spendingData.map(d => d.month),
              datasets: [{ data: spendingData.map(d => d.amount) }]
            }}
            width={screenWidth - 40}
            height={220}
            yAxisLabel="$"
            chartConfig={{
              backgroundColor: colors.neutral.white,
              backgroundGradientFrom: colors.neutral.white,
              backgroundGradientTo: colors.neutral.white,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 109, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16
              },
              barPercentage: 0.5,
            }}
            style={styles.chart}
            showValuesOnTopOfBars={true}
            fromZero={true}
            formatYLabel={(value) => `${(value / 1000).toFixed(0)}k`}
          />
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Income Comparison</Text>
          <BarChart
            data={{
              labels: incomeData.map(d => d.month),
              datasets: [{ data: incomeData.map(d => d.amount) }]
            }}
            width={screenWidth - 40}
            height={220}
            yAxisLabel="$"
            chartConfig={{
              backgroundColor: colors.neutral.white,
              backgroundGradientFrom: colors.neutral.white,
              backgroundGradientTo: colors.neutral.white,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 200, 83, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16
              },
              barPercentage: 0.5,
            }}
            style={styles.chart}
            showValuesOnTopOfBars={true}
            fromZero={true}
            formatYLabel={(value) => `${(value / 1000).toFixed(0)}k`}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
  scrollContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 20,
  },
  chartContainer: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});