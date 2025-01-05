import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { NewBrandingColours } from '../styles/brandingConstants';

const styles = StyleSheet.create({
  card: {
    backgroundColor: NewBrandingColours.neutral.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    // shadowColor: NewBrandingColours.neutral.black,
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
  },
  setupCard: {
    alignItems: 'center',
    // padding: 24,
  },
  setupIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${NewBrandingColours.primary.main}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  setupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: NewBrandingColours.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  setupDescription: {
    fontSize: 14,
    color: NewBrandingColours.text.secondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  setupButton: {
    backgroundColor: NewBrandingColours.primary.main,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  setupButtonText: {
    color: NewBrandingColours.neutral.white,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: NewBrandingColours.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: NewBrandingColours.text.secondary,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: NewBrandingColours.text.primary,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: `${NewBrandingColours.accent.red}15`,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  statItem: {
    width: '50%',
    padding: 8,
  },
  statContent: {
    backgroundColor: NewBrandingColours.neutral.background,
    borderRadius: 12,
    padding: 12,
  },
  statLabel: {
    fontWeight: 'bold',
    fontSize: 13,
    color: NewBrandingColours.text.secondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  statSubtext: {
    fontSize: 12,
    color: NewBrandingColours.text.secondary,
    marginTop: 2,
  },
  warningText: {
    fontSize: 13,
    color: NewBrandingColours.accent.orange,
    marginTop: 8,
  },
});

interface BudgetOverviewProps {
  expectedIncome?: number;
  actualIncome?: number;
  expectedExpenses?: number;
  actualExpenses?: number;
  onSetupBudget?: () => void;
}

export default function BudgetOverviewCard({
  expectedIncome = 0,
  actualIncome = 0,
  expectedExpenses = 0,
  actualExpenses = 0,
  onSetupBudget,
}: BudgetOverviewProps) {
  const isBudgetConfigured = expectedIncome > 0 || expectedExpenses > 0;
  const currentMonth = new Date().toLocaleDateString('default', {
    month: 'long',
  });

  const incomeProgress =
    expectedIncome > 0 ? (actualIncome / expectedIncome) * 100 : 0;
  const expenseProgress =
    expectedExpenses > 0 ? (actualExpenses / expectedExpenses) * 100 : 100;

  // if (!isBudgetConfigured) {
  //   return (
  //     <View style={[styles.card, styles.setupCard]}>
  //       <View style={styles.setupIcon}>
  //         <Icon name="pie-chart" size={24} color={NewBrandingColours.primary.main} />
  //       </View>
  //       <Text style={styles.setupTitle}>Set Up Your Budget</Text>
  //       <Text style={styles.setupDescription}>
  //         Track your spending and saving goals by setting up your monthly budget
  //       </Text>
  //       {/* <TouchableOpacity style={styles.setupButton} onPress={onSetupBudget}>
  //         <Text style={styles.setupButtonText}>Get Started</Text>
  //       </TouchableOpacity> */}
  //     </View>
  //   );
  // }

  const renderProgressBar = (progress: number, color: string) => (
    <View style={styles.progressBar}>
      <View
        style={[
          styles.progressFill,
          {
            width: `${Math.min(progress, 100)}%`,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );

  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  const getProgressColor = (progress: number, income: boolean = false) => {
    if (income) {
      if (progress > 100) return NewBrandingColours.secondary.main;
      if (progress > 90) return NewBrandingColours.accent.orange;
      return NewBrandingColours.accent.red;
    }

    if (progress > 100) return NewBrandingColours.accent.red;
    if (progress > 90) return NewBrandingColours.accent.orange;
    return NewBrandingColours.secondary.main;
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{currentMonth} Budget</Text>
          <Text style={styles.subtitle}>
            {isBudgetConfigured
              ? actualExpenses > expectedExpenses
                ? 'You are over budget :('
                : 'You are on track! :)'
              : 'Set your budget to see your progress'}
          </Text>
        </View>
        {onSetupBudget && (
          <TouchableOpacity onPress={onSetupBudget}>
            <Icon
              name="edit-2"
              size={20}
              color={NewBrandingColours.text.secondary}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <View style={styles.statContent}>
            <Text style={styles.statLabel}>Income</Text>
            <Text
              style={[
                styles.statValue,
                { color: getProgressColor(incomeProgress, true) },
              ]}
            >
              {formatCurrency(actualIncome)}
            </Text>
            {expectedIncome > 0 && (
              <Text style={styles.statSubtext}>
                of {formatCurrency(expectedIncome)} expected
              </Text>
            )}
            {expectedIncome === 0 && (
              <Text style={styles.statSubtext}>None planned</Text>
            )}
          </View>
        </View>

        <View style={styles.statItem}>
          <View style={styles.statContent}>
            <Text style={styles.statLabel}>Expenses</Text>
            <Text
              style={[
                styles.statValue,
                { color: getProgressColor(expenseProgress) },
              ]}
            >
              {formatCurrency(actualExpenses)}
            </Text>
            {expectedExpenses > 0 && (
              <Text style={styles.statSubtext}>
                of {formatCurrency(expectedExpenses)} planned
              </Text>
            )}
            {expectedExpenses === 0 && (
              <Text style={styles.statSubtext}>None planned</Text>
            )}
          </View>
        </View>
      </View>

      {expectedExpenses > 0 && (
        <View style={[styles.progressSection, { marginTop: 16 }]}>
          <Text style={styles.progressLabel}>Expense Budget</Text>
          {renderProgressBar(
            expenseProgress,
            getProgressColor(expenseProgress),
          )}
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text style={styles.subtitle}>
              {expenseProgress > 100
                ? `${(expenseProgress - 100).toFixed(0)}% over budget`
                : `${(100 - expenseProgress).toFixed(0)}% remaining`}
            </Text>
            <Text style={styles.subtitle}>
              {formatCurrency(expectedExpenses - actualExpenses)} left
            </Text>
          </View>
        </View>
      )}

      {(!expectedIncome || !expectedExpenses) && (
        <Text style={styles.warningText}>
          <Icon
            name="alert-circle"
            size={12}
            color={NewBrandingColours.accent.orange}
          />{' '}
          {!expectedIncome && !expectedExpenses
            ? 'Set your expected income and expenses'
            : !expectedIncome
              ? 'Set your expected income'
              : 'Set your expected expenses'}
        </Text>
      )}
    </View>
  );
}
