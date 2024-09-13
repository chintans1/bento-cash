import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { NewBrandingColours } from '../../styles/brandingConstants';
import commonStyles from '../../styles/commonStyles';

import { AppAccount, AppDraftAccount } from '../../models/lunchmoney/appModels';
import { formatAmountString } from '../../data/formatBalance';
import { ImportStackParamList } from '../ImportStackScreen';
import renderNoStateMessage from '../../components/EmptyListComponent';

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

  accountList: {
    flexGrow: 1,
    paddingTop: 8,
  },
  sectionHeader: {
    backgroundColor: NewBrandingColours.neutral.lightGray,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: NewBrandingColours.text.secondary,
  },

  accountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: NewBrandingColours.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    // shadowColor: NewBrandingColours.neutral.black,
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
  },
  accountInfo: {
    flex: 1,
    borderRadius: 12,
  },
  accountName: {
    fontSize: 18,
    fontWeight: '600',
    color: NewBrandingColours.text.primary,
    marginBottom: 4,
  },
  bankName: {
    fontSize: 14,
    color: NewBrandingColours.text.secondary,
    marginBottom: 4,
  },
  accountBalance: {
    fontSize: 16,
    fontWeight: '500',
    color: NewBrandingColours.primary.main,
  },

  selectionContainer: {
    marginLeft: 16,
  },
  selectedIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: NewBrandingColours.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unselectedIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: NewBrandingColours.neutral.gray,
  },

  continueButton: {
    backgroundColor: NewBrandingColours.primary.main,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  continueButtonText: {
    color: NewBrandingColours.neutral.white,
    fontSize: 18,
    fontWeight: '600',
  },
});

type AccountSelectionNavigationProp = NativeStackNavigationProp<
  ImportStackParamList,
  'AccountSelection'
>;
type AccountSelectionRouteProp = RouteProp<
  ImportStackParamList,
  'AccountSelection'
>;

interface AccountSelectionProps {
  route: AccountSelectionRouteProp;
  navigation: AccountSelectionNavigationProp;
}

export default function AccountSelectionScreen({
  route,
  navigation,
}: AccountSelectionProps) {
  const [accounts, setAccounts] = useState([]);
  const [selectedNewAccounts, setSelectedNewAccounts] = useState<
    Record<string, AppDraftAccount>
  >({});
  const [selectedExistingAccounts, setSelectedExistingAccounts] = useState<
    Record<number, AppAccount>
  >({});
  const [isLoading, setIsLoading] = useState(true);

  const { accountsToImport, syncedAccounts, transactionsToImport } =
    route.params;

  useEffect(() => {
    const allAccounts = [...accountsToImport, ...syncedAccounts];

    setAccounts(allAccounts);
    setIsLoading(false);
  }, [accountsToImport, syncedAccounts]); // TODO (mustfix): LINT ERROR

  const toggleAccountSelection = (account: AppAccount | AppDraftAccount) => {
    if ('id' in account && account.id) {
      setSelectedExistingAccounts(prev => {
        const existingSelected = { ...prev };
        if (existingSelected[account.id]) {
          delete existingSelected[account.id];
        } else {
          existingSelected[account.id] = account;
        }
        return existingSelected;
      });
    }
    if ('externalAccountId' in account && account.externalAccountId) {
      setSelectedNewAccounts(prev => {
        const newSelected = { ...prev };
        if (newSelected[account.externalAccountId]) {
          delete newSelected[account.externalAccountId];
        } else {
          newSelected[account.externalAccountId] = account;
        }
        return newSelected;
      });
    }
  };

  const renderAccount = ({ item }) => (
    <TouchableOpacity
      style={styles.accountItem}
      onPress={() => toggleAccountSelection(item)}
    >
      <View style={styles.accountInfo}>
        <Text style={styles.accountName}>{item.accountName}</Text>
        <Text style={styles.bankName}>{item.institutionName}</Text>
        <Text style={styles.accountBalance}>
          {formatAmountString(item.balance)}
        </Text>
      </View>
      <View style={styles.selectionContainer}>
        {selectedNewAccounts[item.externalAccountId] ||
        selectedExistingAccounts[item.id] ? (
          <View style={styles.selectedIcon}>
            <Icon
              name="check"
              size={24}
              color={NewBrandingColours.neutral.white}
            />
          </View>
        ) : (
          <View style={styles.unselectedIcon} />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  const sections = [
    {
      title: 'New Accounts',
      data: accounts.filter(account => !('id' in account)),
    },
    {
      title: 'Existing Accounts',
      data: accounts.filter(account => 'id' in account && account.id),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.headerTitle}>Select Accounts</Text>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={NewBrandingColours.neutral.black}
          />
        ) : (
          <>
            <SectionList
              sections={sections}
              renderItem={renderAccount}
              renderSectionHeader={renderSectionHeader}
              keyExtractor={item =>
                item.id ? item.id : item.externalAccountId
              }
              contentContainerStyle={styles.accountList}
              stickySectionHeadersEnabled={false}
              ListEmptyComponent={renderNoStateMessage(
                'No accounts were found',
              )}
            />
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() =>
                navigation.navigate('ImportSyncConfirmation', {
                  ...route.params,
                  selectedNewAccounts: Object.values(selectedNewAccounts),
                  selectedExistingAccounts: Object.values(
                    selectedExistingAccounts,
                  ),
                  transactionsToImport,
                })
              }
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
