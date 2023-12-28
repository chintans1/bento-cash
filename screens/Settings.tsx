import { useEffect, useRef, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { commonStyles } from "../styles/commonStyles";
import { useParentContext } from "../context/app/appContextProvider";
import InternalLunchMoneyClient from "../clients/lunchMoneyClient";
import { AppLunchMoneyInfo } from "../models/lunchmoney/appModels";
import { brandingColours } from "../styles/brandingConstants";


const settingsStyles = StyleSheet.create({
  textInput: {
    backgroundColor: brandingColours.shadedColour,
    borderColor: brandingColours.secondaryColour,
    borderWidth: 1,
    borderRadius: 10,
    height: 40,
    padding: 10,
  },
  button: {
    backgroundColor: brandingColours.secondaryColour,
    marginTop: 10,
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    color: brandingColours.shadedColour,
    fontWeight: "bold",
    fontSize: 18
  }
});

export default function Settings() {
  const { appState, updateLunchMoneyToken } = useParentContext();
  const { lmApiKey } = appState;

  const lunchMoneyClient = new InternalLunchMoneyClient({ token: lmApiKey });

  const [userInfo, setUserInfo] = useState<AppLunchMoneyInfo|null>(null);
  const [isReady, setIsReady] = useState(false);
  const [newLmApiKey, setNewLmApiKey] = useState<string>("");

  const lmApiKeyInputReference = useRef<TextInput>(null);

  const getUserInfo = async function() {
    if (lmApiKey != null && !isReady) {
      setUserInfo(await lunchMoneyClient.getLunchMoneyInfo());
      setIsReady(true);
    }
  }

  const getUserInfoForNewToken = (newToken: string) => {
    return lunchMoneyClient.getLunchMoneyInfoForToken(newToken);
  }

  const updateAppForNewToken = (newUserInfo: AppLunchMoneyInfo) => {
    updateLunchMoneyToken(newLmApiKey);
    setUserInfo(newUserInfo);
    setNewLmApiKey("");
    lmApiKeyInputReference.current.clear();

    Alert.alert("New budget has been loaded.");
  }

  const verifyNewLmToken = async (newToken: string) => {
    const newUserInfo = await getUserInfoForNewToken(newToken);
    // We have the new user info so we can show the alert

    Alert.alert("Verify loading new budget",
      `You are trying to load budget "${newUserInfo.budgetName}"`,
      [
        {text: "Cancel", style: "cancel", onPress: () => console.log('Cancel Pressed')},
        {text: 'Submit', onPress: () => updateAppForNewToken(newUserInfo)},
      ]);
  }


  useEffect(() => {
    getUserInfo();
  });

  /*
    TODO
      - allow update of LM API token (reloads state completely)
      - store setup token for SimpleFin
      - from that, we can fetch the access URL and store it
      - with access URL details stored, we can always fetch for new updates from accounts on demand
  */

  if (!isReady) {
    return null;
  }

  return (
    <ScrollView
      style={{...commonStyles.container, paddingHorizontal: 15}}
      bounces={false}>

      <View style={commonStyles.card}>
        <Text style={commonStyles.headerTextBold}>Budget Name: {userInfo?.budgetName}</Text>
      </View>

      <View style={commonStyles.columnCard}>
        <Text style={commonStyles.headerText}>Update Lunch Money API Token</Text>
        <TextInput
          ref={lmApiKeyInputReference}
          style={settingsStyles.textInput}
          secureTextEntry={true}
          autoComplete="off"
          autoCorrect={false}
          placeholder={lmApiKey || lmApiKey === newLmApiKey ? "Exists already, only update if you need" : "Enter your API token here"}
          onEndEditing={(event) => setNewLmApiKey(event.nativeEvent.text)} />
        <Pressable
          style={settingsStyles.button}
          disabled={newLmApiKey.length === 0}
          onPress={() => verifyNewLmToken(newLmApiKey)}>
            <Text
              style={[
                settingsStyles.buttonText,
                { color: newLmApiKey.length === 0 ? brandingColours.grey : settingsStyles.buttonText.color },
                { fontWeight: newLmApiKey.length === 0 ? "normal" : settingsStyles.buttonText.fontWeight }
              ]}>Submit</Text>
        </Pressable>
      </View>
      <Text>Simplefin Setup Token</Text>
    </ScrollView>
  )
}