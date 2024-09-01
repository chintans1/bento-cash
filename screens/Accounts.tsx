import React, { useMemo } from 'react';
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useParentContext } from '../context/app/appContextProvider';
import { formatAmountString } from '../data/formatBalance';
import { AccountType, AppAccount } from '../models/lunchmoney/appModels';
import { NewBrandingColours } from '../styles/brandingConstants';

interface GroupedAccounts {
  institution: string;
  data: AppAccount[];
  totalBalance: number;
}

function getAccountIcon(type: AccountType): string {
  switch (type.toLowerCase()) {
    case 'employee compensation':
      return 'trending-up';
    case 'cash':
      return 'credit-card';
    case 'vehicle':
      return 'box';
    case 'loan':
      return 'box';
    case 'cryptocurrency':
      return 'cloud';
    case 'investment':
      return 'trending-up';
    case 'other liability':
      return 'shopping-cart';
    case 'other asset':
      return 'dollar-sign';
    case 'credit':
      return 'shopping-cart';
    case 'real estate':
      return 'home';
    default:
      return 'box';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NewBrandingColours.neutral.background,
    paddingTop: StatusBar.currentHeight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: NewBrandingColours.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: NewBrandingColours.neutral.lightGray,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: NewBrandingColours.text.primary,
  },
  totalBalance: {
    padding: 16,
    backgroundColor: NewBrandingColours.primary.main,
    borderRadius: 8,
    marginBottom: 4,
  },
  totalBalanceLabel: {
    fontSize: 16,
    color: NewBrandingColours.neutral.white,
    marginBottom: 4,
  },
  totalBalanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: NewBrandingColours.neutral.white,
  },
  accountList: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: NewBrandingColours.neutral.lightGray,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 8,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: NewBrandingColours.text.secondary,
  },
  sectionHeaderBalance: {
    fontSize: 16,
    fontWeight: '600',
    color: NewBrandingColours.text.primary,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NewBrandingColours.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: NewBrandingColours.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  accountIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  accountDetails: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: NewBrandingColours.text.primary,
  },
  accountType: {
    fontSize: 14,
    color: NewBrandingColours.text.muted,
  },
  accountBalance: {
    alignItems: 'flex-end',
  },
  balanceAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default function AccountsScreen() {
  const { accounts: accountsMap } = useParentContext().appState;

  const accounts: AppAccount[] = useMemo(
    () => Array.from(accountsMap.values()),
    [accountsMap],
  );
  const netWorth = useMemo(() => {
    return accounts
      .map(account => parseFloat(account.balance))
      .reduce((partialNw, balance) => partialNw + balance, 0);
  }, [accounts]);
  const netWorthString = useMemo(
    () => formatAmountString(netWorth),
    [netWorth],
  );

  const groupedAccounts: GroupedAccounts[] = useMemo(() => {
    const groups: Record<string, AppAccount[]> = accounts.reduce(
      (acc, account) => {
        if (!acc[account.institutionName]) {
          acc[account.institutionName] = [];
        }
        acc[account.institutionName].push(account);
        return acc;
      },
      {} as Record<string, AppAccount[]>,
    );

    return Object.entries(groups).map(([institution, institutionAccounts]) => ({
      institution,
      data: institutionAccounts,
      totalBalance: institutionAccounts.reduce(
        (sum, account) => sum + parseFloat(account.balance),
        0,
      ),
    }));
  }, [accounts]);

  const renderAccount = (account: AppAccount) => {
    return (
      <TouchableOpacity style={styles.accountItem}>
        <View style={[styles.accountIcon, { backgroundColor: 'red' }]}>
          <Icon
            name={getAccountIcon(account.type)}
            size={24}
            color={NewBrandingColours.neutral.white}
          />
        </View>
        <View style={styles.accountDetails}>
          <Text style={styles.accountName}>{account.accountName}</Text>
          <Text style={styles.accountType}>{account.type}</Text>
        </View>
        <View style={styles.accountBalance}>
          <Text
            style={[
              styles.balanceAmount,
              {
                color:
                  parseFloat(account.balance) >= 0
                    ? NewBrandingColours.secondary.main
                    : NewBrandingColours.accent.red,
              },
            ]}
          >
            {formatAmountString(account.balance)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({
    section: { institution, totalBalance },
  }: {
    section: GroupedAccounts;
  }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{institution}</Text>
      <Text style={styles.sectionHeaderBalance}>
        {formatAmountString(totalBalance)}
      </Text>
    </View>
  );

  const renderListHeaderComponent = () => {
    return (
      <View>
        <View style={styles.totalBalance}>
          <Text style={styles.totalBalanceLabel}>Net Worth</Text>
          <Text style={styles.totalBalanceAmount}>{netWorthString}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#4A5568" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Accounts</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ChooseImportMethod')}>
          <Icon name="plus" size={24} color="#4A5568" />
        </TouchableOpacity>
      </View> */}

      <SectionList
        sections={groupedAccounts}
        renderItem={({ item: account }) => renderAccount(account)}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.accountList}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={renderListHeaderComponent}
      />
    </SafeAreaView>
  );
}
