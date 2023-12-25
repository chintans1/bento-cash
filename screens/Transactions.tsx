import { FlatList, View, Text } from 'react-native';
import { commonStyles } from '../styles/commonStyles';
import React, { useContext } from 'react';
import { TransactionComponent } from '../components/Transaction';
import { ParentContext } from '../data/context';

export default function Transactions({ route, navigation }) {
  const { transactions } = useContext(ParentContext);

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.headerTextBold}>Transactions</Text>
      <FlatList
        data={transactions}
        renderItem={({ item }) => <TransactionComponent transaction={item} />}
      />
    </View>
  )
}