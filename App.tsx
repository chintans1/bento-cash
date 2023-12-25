import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { getValueFor } from './utils/secureStore';
import { LocalStorageKeys } from './models/enums/localStorageKeys';
import Initialization from './screens/Initialization';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: 'center',
    justifyContent: 'center',
  }
});


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
    <View style={styles.container}>
      {lmApiKey && lmApiKey.length > 0 ?
        <Text>Lunch Money Key: { lmApiKey }</Text>
        // <StatusBar style="auto" />
      :
        <Initialization />}
    </View>
  );
}