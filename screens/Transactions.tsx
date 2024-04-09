import { SectionList, StyleSheet, Text, View } from 'react-native';
import { commonStyles } from '../styles/commonStyles';
import React from 'react';
import { TransactionComponent } from '../components/Transaction';
import { useParentContext } from '../context/app/appContextProvider';
import { brandingColours } from '../styles/brandingConstants';
import { getGroupedTransactionsByDate } from '../data/utils';
import { format, isToday, isTomorrow, isYesterday, parseISO } from 'date-fns';

const renderNoStateMessage = () => {
  return (
    <View>
      <Text style={commonStyles.textBase}>No recent transactions</Text>
    </View>
  );
}

const formatDate = (dateString: string): string => {
  const date = parseISO(dateString);

  if (isToday(date)) {
    return "Today";
  } else if (isYesterday(date)) {
    return "Yesterday";
  } else if (isTomorrow(date)) {
    return "Tomorrow";
  } else {
    return format(date, 'MMMM d, yyyy');
  }
}

export default function Transactions({ route, navigation }) {
  const { transactions } = useParentContext()?.appState;
  const groupedTransactions = getGroupedTransactionsByDate(transactions);

  const separator = () => {
    return (
      <View style={{
        borderBottomColor: brandingColours.dividerColour,
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginHorizontal: 10
      }} />
    )
  }

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
  )
}