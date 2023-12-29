import { useEffect, useRef, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { commonStyles } from "../styles/commonStyles";
import { useParentContext } from "../context/app/appContextProvider";
import InternalLunchMoneyClient from "../clients/lunchMoneyClient";
import { AppLunchMoneyInfo } from "../models/lunchmoney/appModels";
import { brandingColours } from "../styles/brandingConstants";
import { getClaimUrl, storeSimpleFinAuth } from "../clients/simplefinClient";
import { isAuthPresent, storeAuthenticationDetails } from "../utils/simpleFinAuth";
import { SimpleFinAuthentication } from "../models/simplefin/authentication";


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
    justifyContent: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  buttonText: {
    color: brandingColours.shadedColour,
    fontWeight: "bold",
    fontSize: 18
  }
});

export default function Settings({ navigation }) {
  const { appState, updateLunchMoneyToken } = useParentContext();
  const { lmApiKey } = appState;

  const lunchMoneyClient = new InternalLunchMoneyClient({ token: lmApiKey });

  // Used for component data
  const [userInfo, setUserInfo] = useState<AppLunchMoneyInfo|null>(null);
  const [isReady, setIsReady] = useState(false);

  // Text input state fields
  const [newLmApiKey, setNewLmApiKey] = useState<string>("");
  const [simpleFinToken, setSimpleFinToken] = useState<string>("");
  const [simpleFinTokenExists, setSimpleFinTokenExists] = useState<boolean>(false);

  const lmApiKeyInputReference = useRef<TextInput>(null);
  const simpleFinTokenReference = useRef<TextInput>(null);

  const getUserInfo = async function() {
    if (lmApiKey != null && !isReady) {
      setUserInfo(await lunchMoneyClient.getLunchMoneyInfo());
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

  const verifyNewLmTokenAlert = async (newToken: string) => {
    const newUserInfo = await getUserInfoForNewToken(newToken);
    // We have the new user info so we can show the alert

    Alert.alert("Verify loading new budget",
      `You are trying to load budget "${newUserInfo.budgetName}"`,
      [
        {text: "Cancel", style: "cancel", onPress: () => console.log('Cancel Pressed')},
        {text: 'Submit', onPress: () => updateAppForNewToken(newUserInfo)},
      ]);
  }

  const checkForSimpleFinAuth = async() => {
    if (!isReady) {
      setSimpleFinTokenExists(await isAuthPresent());
    }
  }

  const setupSimpleFinAuthentication = async (newSfToken: string) => {
    const claimUrl = getClaimUrl(newSfToken);
    const simpleFinAuthDetails = await storeSimpleFinAuth(claimUrl);

    Alert.alert("Verify",
      simpleFinTokenExists ?
        "Are you sure you want to override the existing SimpleFIN auth?" :
        "Are you sure you want to set SimpleFIN auth?",
      [
        {text: "Cancel", style: "cancel"},
        {text: "Submit", onPress: () => submitSimpleFinAuth(simpleFinAuthDetails)}
      ]);
  }

  const submitSimpleFinAuth = (simpleFinAuthDetails: SimpleFinAuthentication) => {
    storeAuthenticationDetails(simpleFinAuthDetails);
    setSimpleFinToken("");
    setSimpleFinTokenExists(true);
    simpleFinTokenReference.current.clear();

    Alert.alert("SimpleFIN auth has been saved.");
  }


  useEffect(() => {
    checkForSimpleFinAuth();
    getUserInfo();
    setIsReady(true);
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

      <View style={commonStyles.columnCard}>
        <Text style={commonStyles.headerTextBold}>Budget Name: {userInfo?.budgetName}</Text>
        <Pressable
          style={settingsStyles.button}
          onPress={() => navigation.navigate("SimpleFinImport")}>
            <Text style={settingsStyles.buttonText}>Fetch data via SimpleFIN</Text>
          </Pressable>
      </View>

      <View style={commonStyles.columnCard}>
        <Text style={commonStyles.headerText}>Update Lunch Money API Token</Text>
        <TextInput
          ref={lmApiKeyInputReference}
          style={settingsStyles.textInput}
          secureTextEntry={true}
          autoComplete="off"
          autoCorrect={false}
          placeholder={lmApiKey || lmApiKey === newLmApiKey ? "exists already, update if you need." : "enter your API token here."}
          onEndEditing={(event) => setNewLmApiKey(event.nativeEvent.text)} />
        <Pressable
          style={settingsStyles.button}
          disabled={newLmApiKey.length === 0}
          onPress={() => verifyNewLmTokenAlert(newLmApiKey)}>
            <Text
              style={[
                settingsStyles.buttonText,
                { color: newLmApiKey.length === 0 ? brandingColours.grey : settingsStyles.buttonText.color },
                { fontWeight: newLmApiKey.length === 0 ? "normal" : settingsStyles.buttonText.fontWeight }
              ]}>Submit</Text>
        </Pressable>
      </View>

      <View style={commonStyles.columnCard}>
        <Text>Simplefin Setup Token</Text>
        <TextInput
          ref={simpleFinTokenReference}
          style={settingsStyles.textInput}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder={simpleFinTokenExists ? "exists already, update if you need." : "enter your simpleFIN setup token here."}
          onEndEditing={(event) => setSimpleFinToken(event.nativeEvent.text)} />
        <Pressable
          style={settingsStyles.button}
          disabled={simpleFinToken.length === 0}
          onPress={() => setupSimpleFinAuthentication(simpleFinToken)}>
            <Text
              style={[
                settingsStyles.buttonText,
                { color: simpleFinToken.length === 0 ? brandingColours.grey : settingsStyles.buttonText.color },
                { fontWeight: simpleFinToken.length === 0 ? "normal" : settingsStyles.buttonText.fontWeight }
              ]}>Submit</Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}