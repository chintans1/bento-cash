import { FlatList, StyleSheet, Text, View } from 'react-native';
import { commonStyles } from '../styles/commonStyles';
import React from 'react';
import { TransactionComponent } from '../components/Transaction';
import { useParentContext } from '../context/app/appContextProvider';
import { brandingColours } from '../styles/brandingConstants';

const renderNoStateMessage = () => {
  return (
    <View>
      <Text style={commonStyles.textBase}>No recent transactions</Text>
    </View>
  );
}

export default function Transactions({ route, navigation }) {
  const { transactions } = useParentContext()?.appState;

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
      <FlatList
        style={commonStyles.list}
        data={transactions}
        ItemSeparatorComponent={separator}
        renderItem={({ item }) => <TransactionComponent transaction={item} />}
        ListEmptyComponent={renderNoStateMessage()}
      />
    </View>
  )
}