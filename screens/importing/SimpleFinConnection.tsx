import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NewBrandingColours } from '../../styles/brandingConstants';
import commonStyles from '../../styles/commonStyles';
import { getLastImportDate } from '../../storage/importDate';
import { getAccountsData } from '../../clients/simplefinClient';
import { getSimpleFinAuth } from '../../utils/simpleFinAuth';
import { SimpleFinAuthentication } from '../../models/simplefin/authentication';
import {
  getSerializableImportData,
  SerializableSimpleFinImportData,
} from '../../data/transformSimpleFin';
import { useParentContext } from '../../context/app/appContextProvider';
import { getAccountMappings } from '../../storage/accountMappings';
import { ImportStackParamList } from '../ImportStackScreen';

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

type SimpleFinConnectionNavigationProp = NativeStackNavigationProp<
  ImportStackParamList,
  'SimpleFinConnection'
>;

interface SimpleFinConnectionProps {
  navigation: SimpleFinConnectionNavigationProp;
}

export default function SimpleFinConnectionScreen({
  navigation,
}: SimpleFinConnectionProps) {
  const { accounts: lmAccounts } = useParentContext().appState;
  const [isLoading, setIsLoading] = useState(true);

  // We need to see if there is a SimpleFin token present, then make sure we're able to fetch financial data
  // through getSimpleFinData, we will pass it through to the next screen "ImportAccounts"
  const fetchDataFromSimpleFin = useCallback(async () => {
    console.log('this should only run once');
    const simpleFinAuth: SimpleFinAuthentication = await getSimpleFinAuth();

    // TODO: need to handle errors better for UX
    if (!simpleFinAuth) {
      setIsLoading(false);
      return;
    }

    const lastImportDate = await getLastImportDate();
    let importData: SerializableSimpleFinImportData;

    try {
      const fetchedAccountsResponse = await getAccountsData(
        await getSimpleFinAuth(),
        lastImportDate,
      );

      const fetchedAccountMappings = await getAccountMappings();

      importData = getSerializableImportData(
        fetchedAccountMappings,
        lmAccounts,
        fetchedAccountsResponse,
      );
    } catch (err) {
      Alert.alert('An error occurred', `${err}`, [
        { text: 'Ok', onPress: () => navigation.getParent()?.goBack() },
      ]);
      setIsLoading(false);
    }

    navigation.replace('AccountSelection', {
      accountsToImport: importData.accountsToImport,
      syncedAccounts: importData.syncedAccounts,
      transactionsToImport: importData.transactionsToImport,
    });
  }, [navigation, lmAccounts]);

  useEffect(() => {
    fetchDataFromSimpleFin();
  }, [fetchDataFromSimpleFin]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {isLoading ? (
          <View>
            <ActivityIndicator
              size="large"
              color={NewBrandingColours.neutral.black}
            />
            <Text
              style={{
                color: NewBrandingColours.text.muted,
                fontSize: 14,
                paddingTop: 8,
              }}
            >
              Fetching accounts data...
            </Text>
          </View>
        ) : (
          <Text style={styles.tokenPrompt}>
            Your SimpleFIN setup is not correct. Please check in Settings.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}
