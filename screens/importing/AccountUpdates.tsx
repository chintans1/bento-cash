import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { NewBrandingColours } from '../../styles/brandingConstants';
import commonStyles from '../../styles/commonStyles';
import {
  getAccountMappings,
  storeAccountMappings,
} from '../../storage/accountMappings';
import { useParentContext } from '../../context/app/appContextProvider';
import InternalLunchMoneyClient from '../../clients/lunchMoneyClient';
import { AccountType } from '../../models/lunchmoney/appModels';
import { ImportStackParamList } from '../ImportStackScreen';
import { ErrorType, handleError } from '../../utils/errorHandler';

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
  },
  content: {
    ...commonStyles.content,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: NewBrandingColours.text.muted,
    fontSize: 14,
    paddingTop: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: NewBrandingColours.text.secondary,
    textAlign: 'center',
    marginTop: 16,
  },
});

type AccountUpdatesNavigationProp = NativeStackNavigationProp<
  ImportStackParamList,
  'AccountUpdates'
>;
type AccountUpdatesRouteProp = RouteProp<
  ImportStackParamList,
  'AccountUpdates'
>;

interface AccountUpdatesProps {
  route: AccountUpdatesRouteProp;
  navigation: AccountUpdatesNavigationProp;
}

export default function AccountUpdatesScreen({
  route,
  navigation,
}: AccountUpdatesProps) {
  const { lmApiKey, accounts: lmAccounts } = useParentContext().appState;
  const lunchMoneyClient = new InternalLunchMoneyClient({ token: lmApiKey });

  const [isUpdating, setIsUpdating] = useState<boolean>(true);
  const {
    selectedNewAccounts,
    selectedExistingAccounts,
    transactionsToImport,
  } = route.params;

  const handleAccountCreation = async () => {
    if (selectedNewAccounts === null || selectedNewAccounts.length <= 0) {
      return;
    }

    const existingAccountMappings: Map<string, string> =
      await getAccountMappings();
    const promises: Promise<void>[] = [];

    selectedNewAccounts.forEach(async accountToCreate => {
      const { lmAccount } = accountToCreate;
      console.log(accountToCreate);

      if (lmAccount != null && lmAccount.id) {
        // This is for new SF accounts being linked to existing LM accounts
        const existingLmAccountId = lmAccount.id;
        let accountType: AccountType | undefined;
        if (lmAccounts.has(existingLmAccountId)) {
          accountType = lmAccounts.get(existingLmAccountId).type;
        }

        const updatePromise = lunchMoneyClient
          .updateDraftAccountBalance({
            ...accountToCreate,
            type: accountType,
          })
          .then(() => {
            existingAccountMappings.set(
              accountToCreate.externalAccountId,
              existingLmAccountId.toString(),
            );
          })
          .catch(err => {
            console.error(`Failed to sync account balance: ${err}`);
            handleError({
              errorType: ErrorType.LUNCH_MONEY_API_ERROR,
              message: `Failed to sync account balance for account ${accountToCreate.accountName}, error ${err}`,
            });
          });

        promises.push(updatePromise);
      } else {
        const createPromise = lunchMoneyClient
          .createAccount(accountToCreate)
          .then(createdAccount => {
            existingAccountMappings.set(
              accountToCreate.externalAccountId,
              createdAccount.id.toString(),
            );
          })
          .catch(err => {
            console.error(`Failed to create account in import flow: ${err}`);
            handleError({
              errorType: ErrorType.LUNCH_MONEY_API_ERROR,
              message: `Failed to create account ${accountToCreate.accountName}, error ${err}`,
            });
          });

        promises.push(createPromise);
      }
    });

    await Promise.all(promises);

    await storeAccountMappings(existingAccountMappings);
  };

  const handleSyncingAccounts = async () => {
    // need to gather accounts that exist (AppAccount specifically, any draft accounts were already created)
    // only sync accounts where LM account exists, we need to ensure the mapping is legitimate
    // to ensure mapping is legitimate, we can filter using lmAccounts, already present
    if (
      selectedExistingAccounts === null ||
      selectedExistingAccounts.length <= 0
    ) {
      return;
    }

    selectedExistingAccounts.forEach(accountToUpdate => {
      lunchMoneyClient
        .updateAccountBalance(accountToUpdate)
        .then(() => console.log('account updated'))
        .catch(error =>
          console.log(`failed to update account balance: ${error}`),
        );
    });
  };

  // We need to create those new accounts and need to update the selected existing accounts
  // At the same time, we need to save that mapping again
  const createAndSyncAccounts = useCallback(async () => {
    // Should only run once
    console.log('We should only run createAndSyncAccounts once and leave');
    try {
      await handleAccountCreation();
      await handleSyncingAccounts();

      Toast.show({
        type: 'success',
        text1: 'Accounts Synced',
        text2: 'All selected accounts are available in Lunch Money.',
        position: 'top',
        visibilityTime: 5000,
      });
    } catch (error) {
      setIsUpdating(false);
      return;
    }

    navigation.replace('TransactionSelection', { transactionsToImport });
  }, [
    navigation,
    handleAccountCreation,
    handleSyncingAccounts,
    transactionsToImport,
  ]);

  useEffect(() => {
    createAndSyncAccounts();
  }, [createAndSyncAccounts]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {isUpdating ? (
          <View>
            <ActivityIndicator
              size="large"
              color={NewBrandingColours.neutral.black}
            />
            <Text style={styles.loadingText}>Updating...</Text>
          </View>
        ) : (
          <Text style={styles.errorMessage}>
            Failed to update, please try again later.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}
