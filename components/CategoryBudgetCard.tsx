import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NewBrandingColours } from '../styles/brandingConstants';

interface CategoryBudgetCardProps {
  categoryName: string;
  budget: number;
  actual: number;
  color: string;
  icon?: string;
}

function CategoryBudgetCard({
  categoryName,
  budget,
  actual,
  color,
}: CategoryBudgetCardProps) {
  const remaining = budget - actual;
  const percentage = budget > 0 ? (actual / budget) * 100 : 0;
  const isOverBudget = actual > budget;

  // Format currency
  const formatCurrency = (amount: number) => {
    return `$${Math.abs(amount).toFixed(0)}`;
  };

  // Determine status color
  const statusColor = isOverBudget
    ? NewBrandingColours.accent.red
    : remaining < budget * 0.2
      ? NewBrandingColours.accent.orange
      : NewBrandingColours.secondary.main;

  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={styles.header}>
        <Text style={styles.categoryName}>{categoryName}</Text>
        <View style={[styles.progressCircle, { borderColor: statusColor }]}>
          <Text style={[styles.percentageText, { color: statusColor }]}>
            {Math.min(percentage, 100).toFixed(0)}%
          </Text>
        </View>
      </View>

      <View style={styles.amountsContainer}>
        <View style={styles.amountRow}>
          <Text style={styles.label}>Budget</Text>
          <Text style={styles.amount}>{formatCurrency(budget)}</Text>
        </View>

        <View style={styles.amountRow}>
          <Text style={styles.label}>Actual</Text>
          <Text style={[styles.amount, styles.actualAmount]}>
            {formatCurrency(actual)}
          </Text>
        </View>

        <View style={styles.amountRow}>
          <Text style={styles.label}>Remaining</Text>
          <Text
            style={[
              styles.amount,
              styles.remainingAmount,
              { color: statusColor },
            ]}>
            {isOverBudget ? '-' : ''}
            {formatCurrency(Math.abs(remaining))}
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: statusColor,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: NewBrandingColours.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    color: NewBrandingColours.text.primary,
  },
  progressCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: NewBrandingColours.neutral.background,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '700',
  },
  amountsContainer: {
    marginBottom: 12,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: NewBrandingColours.text.muted,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: NewBrandingColours.text.primary,
  },
  actualAmount: {
    color: NewBrandingColours.text.secondary,
  },
  remainingAmount: {
    fontWeight: '700',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: NewBrandingColours.neutral.lightGray,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
});

export default CategoryBudgetCard;
