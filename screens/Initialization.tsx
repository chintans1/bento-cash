import React, { useEffect, useState } from "react";
import { StyleSheet, View, Button, TextInput } from 'react-native';
import { useParentContext } from "../context/app/appContextProvider";
import { brandingColours } from "../styles/brandingConstants";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  textInput: {
    backgroundColor: brandingColours.shadedColour,
    color: brandingColours.secondaryColour,

    borderColor: brandingColours.secondaryColour,
    borderWidth: 1,
    borderRadius: 10,

    padding: 15,
  },
});

export default function Initialization() {
  const { updateLunchMoneyToken } = useParentContext();
  const { lmApiKey } = useParentContext().appState;

  const [lunchMoneyKey, setLunchMoneyKey] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [render, setRender] = useState<boolean>(false);

  async function submitLunchMoneyKey() {
    setLoading(true);
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
    return null;
  }

  return (
    <View style={styles.container}>
      <View>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => setLunchMoneyKey(text)}
          value={lunchMoneyKey}
          placeholder="Enter your Lunch Money API token here"
          autoCapitalize={'none'}
        />
      </View>
      <View>
        <Button title="Submit" disabled={loading} onPress={() => submitLunchMoneyKey()} />
      </View>
    </View>
  )
}