import { StatusBar } from 'expo-status-bar';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { getValueFor } from './utils/secureStore';
import { LocalStorageKeys } from './models/enums/localStorageKeys';
import Initialization from './screens/Initialization';
import Transactions from './screens/Transactions';
import { commonStyles } from './styles/commonStyles';
import Charts from './screens/Charts';

const styles = StyleSheet.create({
  bottomBar: {
    marginBottom: 10,
    padding: 15,
    justifyContent: "space-between",
    flexDirection: "row"
  }
});

export default function App() {
  // getLunchMoneyTransactions();
  const [lmApiKey, setLmApiKey] = React.useState<string | null>(null)
  const [showTransactions, setTransactionsView] = React.useState(true);

  React.useEffect(() => {
    getValueFor(LocalStorageKeys.LUNCH_MONEY_KEY).then((lmValue) => {
      setLmApiKey(lmValue)
    });
  }, [])

  return (
    <View style={{flex: 1}}>
      <StatusBar
        animated={true}
        style="auto"
      />
      {lmApiKey && lmApiKey.length > 0 ?
        <View style={commonStyles.container}>
          {showTransactions ?
            <Transactions lmApiKey={lmApiKey} />
          :
            <Charts lmApiKey={lmApiKey} />}
          <View style={styles.bottomBar}>
            <Button
              title="Transactions"
              onPress={() => setTransactionsView(true)}
            />
            <Button
              title="Charts"
              onPress={() => setTransactionsView(false)}
            />
          </View>
        </View>
      :
        <Initialization />}
    </View>
  );
}