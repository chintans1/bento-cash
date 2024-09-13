import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import commonStyles from '../../styles/commonStyles';
import { NewBrandingColours } from '../../styles/brandingConstants';
import { ImportStackParamList } from '../ImportStackScreen';
import { AppAccount, AppDraftAccount } from '../../models/lunchmoney/appModels';

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
  },
  content: {
    ...commonStyles.content,
  },
  headerTitle: {
    ...commonStyles.headerText,
    fontSize: 28,
    color: NewBrandingColours.text.primary,
    marginBottom: 4,
  },

  accountListContainer: {
    marginBottom: 24,
  },
  accountListTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: NewBrandingColours.text.primary,
    marginBottom: 12,
  },

  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NewBrandingColours.neutral.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: NewBrandingColours.neutral.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  accountIcon: {
    marginRight: 12,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '500',
    color: NewBrandingColours.text.primary,
  },
  bankName: {
    fontSize: 14,
    color: NewBrandingColours.text.secondary,
  },
  accountType: {
    fontSize: 12,
    color: NewBrandingColours.text.muted,
    marginTop: 2,
  },
  defaultIndicator: {
    fontSize: 10,
    color: NewBrandingColours.accent.orange,
    marginLeft: 4,
  },
  accountBalance: {
    fontSize: 14,
    color: NewBrandingColours.primary.main,
    marginTop: 4,
  },
  noAccountsSelected: {
    color: NewBrandingColours.text.muted,
  },

  summaryContainer: {
    backgroundColor: NewBrandingColours.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: NewBrandingColours.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryText: {
    fontSize: 16,
    color: NewBrandingColours.text.secondary,
    lineHeight: 24,
  },

  buttonDisabled: {
    opacity: 0.5,
  },
  customizeButton: {
    backgroundColor: NewBrandingColours.neutral.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: NewBrandingColours.primary.main,
  },
  customizeButtonText: {
    color: NewBrandingColours.primary.main,
    fontSize: 18,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: NewBrandingColours.primary.main,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: NewBrandingColours.neutral.white,
    fontSize: 18,
    fontWeight: '600',
  },
});

type ImportSyncConfirmationNavigationProp = NativeStackNavigationProp<
  ImportStackParamList,
  'ImportSyncConfirmation'
>;
type ImportSyncConfirmationRouteProp = RouteProp<
  ImportStackParamList,
  'ImportSyncConfirmation'
>;

interface ImportSyncConfirmationProps {
  route: ImportSyncConfirmationRouteProp;
  navigation: ImportSyncConfirmationNavigationProp;
}

export default function ImportSyncConfirmationScreen({
  route,
  navigation,
}: ImportSyncConfirmationProps) {
  const {
    selectedNewAccounts,
    selectedExistingAccounts,
    transactionsToImport,
  } = route.params;

  const renderAccountList = (
    accounts: AppAccount[] | AppDraftAccount[],
    title: string,
  ) => (
    <View style={styles.accountListContainer}>
      <Text style={styles.accountListTitle}>{title}</Text>
      {accounts.length > 0 ? (
        accounts.map(account => (
          <View
            key={account.id ? account.id : account.externalAccountId}
            style={styles.accountItem}
          >
            <Icon
              name="check-circle"
              size={20}
              color={NewBrandingColours.secondary.main}
              style={styles.accountIcon}
            />
            <View style={styles.accountInfo}>
              <Text style={styles.accountName}>{account.accountName}</Text>
              <Text style={styles.bankName}>{account.institutionName}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.accountType}>{account.type || 'Cash'}</Text>
                {!account.type && (
                  <Text style={styles.defaultIndicator}>(default)</Text>
                )}
              </View>

              <View>
                {account.lmAccount ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon
                      name="link"
                      size={12}
                      color={NewBrandingColours.text.muted}
                    />
                    <Text
                      style={[
                        styles.bankName,
                        { marginLeft: 4, color: NewBrandingColours.text.muted },
                      ]}
                    >
                      {account.lmAccount?.accountName}
                    </Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.accountBalance}>
                $
                {Math.abs(account.balance).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noAccountsSelected}>No accounts selected</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.headerTitle}>Confirm Import & Sync</Text>

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>
            You are about to import {selectedNewAccounts.length} new account
            {selectedNewAccounts.length !== 1 ? 's' : ''} and continue syncing{' '}
            {selectedExistingAccounts.length} existing account
            {selectedExistingAccounts.length !== 1 ? 's' : ''}.
          </Text>
        </View>

        {renderAccountList(selectedNewAccounts, 'New Accounts to Import')}
        {renderAccountList(
          selectedExistingAccounts,
          'Existing Accounts to Sync',
        )}

        <TouchableOpacity
          style={[
            styles.customizeButton,
            selectedNewAccounts.length === 0 && styles.buttonDisabled,
          ]}
          disabled={selectedNewAccounts.length === 0}
          onPress={() =>
            navigation.navigate('AccountCustomization', {
              ...route.params,
              selectedNewAccounts,
            })
          }
        >
          <Text style={styles.customizeButtonText}>Customize New Accounts</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => {
            // Handle confirmation logic here
            navigation.navigate('AccountUpdates', {
              ...route.params,
              selectedNewAccounts,
              selectedExistingAccounts,
              transactionsToImport,
            });
          }}
        >
          <Text style={styles.confirmButtonText}>Confirm and Proceed</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
