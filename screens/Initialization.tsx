import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useParentContext } from '../context/app/appContextProvider';
import { BrandingColours } from '../styles/brandingConstants';
import commonStyles from '../styles/oldCommonStyles';
import accessClient from '../clients/accessClient';

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    ...commonStyles.columnCard,
    padding: 25,
  },
  textInput: {
    backgroundColor: BrandingColours.shadedColour,
    color: BrandingColours.secondaryColour,

    borderColor: BrandingColours.secondaryColour,
    borderWidth: 1,
    borderRadius: 10,

    padding: 12,
    marginVertical: 8,
    height: 40,
  },
  button: {
    backgroundColor: BrandingColours.secondaryColour,
    height: 40,
    borderColor: '#8ECAE6',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: BrandingColours.shadedColour,
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default function Initialization() {
  const { updateLunchMoneyToken } = useParentContext();
  const { lmApiKey } = useParentContext().appState;

  const [lunchMoneyKey, setLunchMoneyKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [render, setRender] = useState<boolean>(false);

  async function submitLunchMoneyKey() {
    setLoading(true);

    const tokenValid = await accessClient.isTokenValid(lunchMoneyKey);
    if (!tokenValid) {
      setLunchMoneyKey('');
      setRender(true);
      setLoading(false);
      return;
    }
    updateLunchMoneyToken(lunchMoneyKey);

    setRender(false);
    setLoading(false);
  }

  useEffect(() => {
    if (lmApiKey.length === 0) {
      setRender(true);
    }
  }, [lmApiKey]);

  if (!render) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={BrandingColours.primaryColour} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={commonStyles.headerTextBold}>Setup</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={text => setLunchMoneyKey(text)}
          value={lunchMoneyKey}
          placeholder="Enter your Lunch Money API token here"
          autoCapitalize="none"
        />
        <TouchableOpacity
          disabled={loading}
          style={styles.button}
          onPress={() => submitLunchMoneyKey()}
        >
          <Text
            style={[
              styles.buttonText,
              { opacity: lunchMoneyKey.length === 0 ? 0.3 : null },
            ]}
          >
            Submit
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
