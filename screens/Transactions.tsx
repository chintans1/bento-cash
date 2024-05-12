import { SectionList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { format, isToday, isTomorrow, isYesterday, parseISO } from 'date-fns';
import commonStyles from '../styles/commonStyles';
import TransactionComponent from '../components/Transaction';
import { useParentContext } from '../context/app/appContextProvider';
import BrandingColours from '../styles/brandingConstants';
import { getGroupedTransactionsByDate } from '../data/utils';

const renderNoStateMessage = () => {
  return (
    <View>
      <Text style={commonStyles.textBase}>No recent transactions</Text>
    </View>
  );
};

const formatDate = (dateString: string): string => {
  const date = parseISO(dateString);

  if (isToday(date)) {
    return 'Today';
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  if (isTomorrow(date)) {
    return 'Tomorrow';
  }
  return format(date, 'MMMM d, yyyy');
};

export default function Transactions() {
  const { transactions } = useParentContext()?.appState ?? {};
  const groupedTransactions = getGroupedTransactionsByDate(transactions);

  const separator = () => {
    return (
      <View
        style={{
          borderBottomColor: BrandingColours.dividerColour,
          borderBottomWidth: StyleSheet.hairlineWidth,
          marginHorizontal: 10,
        }}
      />
    );
  };

  return (
    <View style={commonStyles.container}>
      <SectionList
        style={commonStyles.list}
        sections={groupedTransactions}
        ItemSeparatorComponent={separator}
        renderSectionHeader={({ section: { title: date } }) => (
          <Text style={commonStyles.sectionHeader}>{formatDate(date)}</Text>
        )}
        renderItem={({ item }) => <TransactionComponent transaction={item} />}
        ListEmptyComponent={renderNoStateMessage()}
      />
    </View>
  );
}
