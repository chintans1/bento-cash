import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { getValueFor } from './utils/secureStore';
import { LocalStorageKeys } from './models/enums/localStorageKeys';
import Initialization from './screens/Initialization';
import Transactions from './screens/Transactions';
import { commonStyles } from './styles/commonStyles';

export default function App() {
  // getLunchMoneyTransactions();
  const [lmApiKey, setLmApiKey] = React.useState<string | null>(null)

  React.useEffect(() => {
    getValueFor(LocalStorageKeys.LUNCH_MONEY_KEY).then((lmValue) => {
      setLmApiKey(lmValue)
    });

    // supabase.auth.onAuthStateChange((_event, session) => {
    //   setSession(session)
    // })
  }, [])

  return (
    <View style={commonStyles.container}>
      {lmApiKey && lmApiKey.length > 0 ?
      // <style={styles.container}>
        // <Text>Lunch Money Key: { lmApiKey }</Text>
        <Transactions lmApiKey={lmApiKey} />
        // <StatusBar style="auto" />
      // </>
      :
        <Initialization />}
    </View>
  );
}