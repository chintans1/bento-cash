import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NewBrandingColours } from "../../styles/brandingConstants";
import commonStyles from "../../styles/commonStyles";
import { getLastImportDate } from "../../clients/storageClient";
import { AccountsResponse } from "../../models/simplefin/accounts";
import { getAccountsData } from "../../clients/simplefinClient";
import { getSimpleFinAuth } from "../../utils/simpleFinAuth";
import { SimpleFinAuthentication } from "../../models/simplefin/authentication";

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
  },
  content: {
    ...commonStyles.content,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...commonStyles.headerText,
    fontSize: 28,
    color: NewBrandingColours.text.primary,
    marginBottom: 4,
  },
  tokenPrompt: {
    fontSize: 16,
    color: NewBrandingColours.text.secondary,
    textAlign: 'center',
    marginTop: 16,
  },
});


export default function SimpleFinConnectionScreen({ navigation }) {
  const [isSimpleFinSetup, setIsSimpleFinSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // We need to see if there is a SimpleFin token present, then make sure we're able to fetch financial data
  // through getSimpleFinData, we will pass it through to the next screen "ImportAccounts"
  const fetchDataFromSimpleFin = useCallback(async () => {
    console.log("this should only run once");
    const simpleFinAuth: SimpleFinAuthentication = await getSimpleFinAuth();

    if (!simpleFinAuth) {
      setIsSimpleFinSetup(false);
      return;
    }

    const lastImportDate = await getLastImportDate();
    let fetchedAccountsResponse: AccountsResponse;

    try {
      fetchedAccountsResponse = await getAccountsData(
        await getSimpleFinAuth(),
        lastImportDate,
      );
    } catch (err) {
      Alert.alert('An error occurred', `${err}`, [
        { text: 'Ok', onPress: () => navigation.getParent()?.goBack() },
      ]);
      setIsLoading(false);
    }

    navigation.navigate("AccountSelection", { accountsResponse: fetchedAccountsResponse });
  }, []);

  useEffect(() => {
    fetchDataFromSimpleFin();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {isLoading ? (
              <ActivityIndicator size="large" color={NewBrandingColours.neutral.black} />
            ) : (
          <Text style={styles.tokenPrompt}>Your SimpleFIN setup is not correct. Please check in Settings.</Text>
        )}
      </View>
    </SafeAreaView>
  );
}