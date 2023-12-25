import { FlatList, View, Text } from 'react-native';
import { getAllTransactions } from '../clients/lunchMoneyClient';
import { commonStyles } from '../styles/commonStyles';
import { Transaction } from 'lunch-money';
import React, { useState, useEffect } from 'react';
import { TransactionComponent } from '../components/Transaction';

function getLunchMoneyTransactions(lmApiKey: string): Promise<Transaction[]> {
  return getAllTransactions(lmApiKey);
}

export default function Transactions({ lmApiKey }: { lmApiKey: string }) {
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    getLunchMoneyTransactions(lmApiKey)
      .then(fetchedTransactions => setTransactions(fetchedTransactions));
  });

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