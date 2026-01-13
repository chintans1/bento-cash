import { startOfMonth, endOfMonth, subMonths, format, parseISO } from 'date-fns';
import { AppTransaction, AppCategory } from '../models/lunchmoney/appModels';
import { NewBrandingColours } from '../styles/brandingConstants';

export interface SpendingComparisonData {
  thisMonth: number[];
  lastMonth: number[];
  labels: string[];
}

export interface CashFlowData {
  income: number[];
  expenses: number[];
  labels: string[];
}

export interface CategoryExpenseData {
  categoryName: string;
  amount: number;
  color: string;
}

/**
 * Get spending comparison data for line chart (this month vs last month)
 * Groups spending by week within each month
 */
export const getSpendingComparisonData = (
  transactions: AppTransaction[],
): SpendingComparisonData => {
  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  // Filter transactions
  const thisMonthTxns = transactions.filter(txn => {
    const txnDate = parseISO(txn.date);
    return (
      !txn.isIncome &&
      !txn.excludeFromTotals &&
      txnDate >= thisMonthStart &&
      txnDate <= thisMonthEnd
    );
  });

  const lastMonthTxns = transactions.filter(txn => {
    const txnDate = parseISO(txn.date);
    return (
      !txn.isIncome &&
      !txn.excludeFromTotals &&
      txnDate >= lastMonthStart &&
      txnDate <= lastMonthEnd
    );
  });

  // Group by week (1-7, 8-14, 15-21, 22-end)
  const groupByWeek = (txns: AppTransaction[], monthStart: Date) => {
    const weeks = [0, 0, 0, 0];
    txns.forEach(txn => {
      const txnDate = parseISO(txn.date);
      const dayOfMonth = txnDate.getDate();
      const weekIndex =
        dayOfMonth <= 7 ? 0 : dayOfMonth <= 14 ? 1 : dayOfMonth <= 21 ? 2 : 3;

      weeks[weekIndex] += Math.abs(parseFloat(txn.amountToBase));
    });
    return weeks;
  };

  const thisMonthData = groupByWeek(thisMonthTxns, thisMonthStart);
  const lastMonthData = groupByWeek(lastMonthTxns, lastMonthStart);

  return {
    thisMonth: thisMonthData,
    lastMonth: lastMonthData,
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  };
};

/**
 * Get cash flow data for stacked bar chart (income vs expenses)
 * Shows last 6 months
 */
export const getCashFlowData = (
  transactions: AppTransaction[],
  monthsToShow: number = 6,
): CashFlowData => {
  const now = new Date();
  const months: Date[] = [];

  // Generate months array
  for (let i = monthsToShow - 1; i >= 0; i--) {
    months.push(subMonths(now, i));
  }

  const income: number[] = [];
  const expenses: number[] = [];
  const labels: string[] = [];

  months.forEach(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);

    const monthTxns = transactions.filter(txn => {
      const txnDate = parseISO(txn.date);
      return (
        !txn.excludeFromTotals && txnDate >= monthStart && txnDate <= monthEnd
      );
    });

    let monthIncome = 0;
    let monthExpenses = 0;

    monthTxns.forEach(txn => {
      const amount = Math.abs(parseFloat(txn.amountToBase));
      if (txn.isIncome) {
        monthIncome += amount;
      } else {
        monthExpenses += amount;
      }
    });

    income.push(monthIncome);
    expenses.push(monthExpenses);
    labels.push(format(month, 'MMM'));
  });

  return { income, expenses, labels };
};

/**
 * Get top expense categories for current month
 */
export const getTopExpenseCategories = (
  transactions: AppTransaction[],
  categories: Map<number, AppCategory>,
  limit: number = 5,
): CategoryExpenseData[] => {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  // Filter to current month expenses
  const monthTxns = transactions.filter(txn => {
    const txnDate = parseISO(txn.date);
    return (
      !txn.isIncome &&
      !txn.excludeFromTotals &&
      txnDate >= monthStart &&
      txnDate <= monthEnd &&
      txn.categoryId != null
    );
  });

  // Group by category
  const categoryTotals = new Map<number, number>();
  monthTxns.forEach(txn => {
    const amount = Math.abs(parseFloat(txn.amountToBase));
    const current = categoryTotals.get(txn.categoryId!) || 0;
    categoryTotals.set(txn.categoryId!, current + amount);
  });

  // Convert to array and sort
  const categoryArray = Array.from(categoryTotals.entries())
    .map(([categoryId, amount]) => ({
      categoryId,
      categoryName: categories.get(categoryId)?.name || 'Unknown',
      amount,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);

  // Assign colors
  const colors = [
    NewBrandingColours.primary.main,
    NewBrandingColours.secondary.main,
    NewBrandingColours.accent.purple,
    NewBrandingColours.accent.orange,
    NewBrandingColours.accent.yellow,
  ];

  return categoryArray.map((item, index) => ({
    categoryName: item.categoryName,
    amount: item.amount,
    color: colors[index % colors.length],
  }));
};

/**
 * Get category budget data with actual spending
 */
export const getCategoryBudgetData = (
  transactions: AppTransaction[],
  categories: Map<number, AppCategory>,
  categoryId: number,
  budget: number,
): { actual: number; remaining: number } => {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const categoryTxns = transactions.filter(txn => {
    const txnDate = parseISO(txn.date);
    return (
      !txn.isIncome &&
      !txn.excludeFromTotals &&
      txnDate >= monthStart &&
      txnDate <= monthEnd &&
      txn.categoryId === categoryId
    );
  });

  const actual = categoryTxns.reduce(
    (sum, txn) => sum + Math.abs(parseFloat(txn.amountToBase)),
    0,
  );

  return {
    actual,
    remaining: budget - actual,
  };
};

/**
 * Get monthly spending totals for the current year
 */
export const getMonthlySpendingData = (
  transactions: AppTransaction[],
): { data: number[]; labels: string[] } => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const monthlyTotals: number[] = [];
  const labels: string[] = [];

  for (let month = 0; month <= currentMonth; month++) {
    const monthStart = new Date(currentYear, month, 1);
    const monthEnd = endOfMonth(monthStart);

    const monthTxns = transactions.filter(txn => {
      const txnDate = parseISO(txn.date);
      return (
        !txn.isIncome &&
        !txn.excludeFromTotals &&
        txnDate >= monthStart &&
        txnDate <= monthEnd
      );
    });

    const total = monthTxns.reduce(
      (sum, txn) => sum + Math.abs(parseFloat(txn.amountToBase)),
      0,
    );

    monthlyTotals.push(total);
    labels.push(format(monthStart, 'MMM'));
  }

  return { data: monthlyTotals, labels };
};
