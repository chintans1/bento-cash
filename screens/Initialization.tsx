import React from "react";
import { StyleSheet, View, Button, TextInput } from 'react-native';
import { save } from "../utils/secureStore";
import { StorageKeys } from "../models/enums/storageKeys";

export default function Initialization() {
  const [lunchMoneyKey, setLunchMoneyKey] = React.useState('');
  const [loading, setLoading] = React.useState(false)

  async function submitLunchMoneyKey() {
    setLoading(true)
    await save(StorageKeys.LUNCH_MONEY_KEY, lunchMoneyKey);

    // if (error) Alert.alert(error.message)
    // if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TextInput
          // la="Email"
          // leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => setLunchMoneyKey(text)}
          value={lunchMoneyKey}
          placeholder="lunch money API key"
          autoCapitalize={'none'}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Button title="Submit" disabled={loading} onPress={() => submitLunchMoneyKey()} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})