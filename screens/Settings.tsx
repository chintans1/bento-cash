import { useContext, useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { commonStyles } from "../styles/commonStyles";
import { ParentContext } from "../data/context";
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
  }
});
export default function Settings() {
  const { lmApiKey } = useContext(ParentContext);

  const [userInfo, setUserInfo] = useState<AppLunchMoneyInfo|null>(null);
  const [isReady, setIsReady] = useState(false);

  const getUserInfo = async function() {
    if (lmApiKey != null) {
      const lunchMoneyClient = new InternalLunchMoneyClient({ token: lmApiKey });
      setUserInfo(await lunchMoneyClient.getLunchMoneyInfo());
      setIsReady(true);
    }
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
      <Text style={commonStyles.headerTextBold}>Budget Name: {userInfo?.budgetName}</Text>
      <Text style={commonStyles.headerTextBold}>Lunch Money API token</Text>
      <TextInput
        style={settingsStyles.textInput}
        secureTextEntry={true}
        placeholder={lmApiKey ? "Exists already, only update if you need" : "Enter your API token here"} />

      <Text>Simplefin Setup Token</Text>
    </ScrollView>
  )
}