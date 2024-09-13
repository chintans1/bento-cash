import React, { useMemo } from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useParentContext } from '../context/app/appContextProvider';
import { formatAmountString } from '../data/formatBalance';
import { AppAccount } from '../models/lunchmoney/appModels';
import { NewBrandingColours } from '../styles/brandingConstants';
import AccountComponent from '../components/Account';
import renderNoStateMessage from '../components/EmptyListComponent';

interface GroupedAccounts {
  institution: string;
  data: AppAccount[];
  totalBalance: number;
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
    flexGrow: 1,
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
});

export default function AccountsScreen() {
  const { accounts: accountsMap } = useParentContext().appState;

  const accounts: AppAccount[] = useMemo(
    () =>
      Array.from(accountsMap.values()).filter(
        account => account.state === 'open',
      ),
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

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        ListHeaderComponent={renderListHeaderComponent}
        sections={groupedAccounts}
        renderItem={({ item: account }) => (
          <AccountComponent account={account} />
        )}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.accountList}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={renderNoStateMessage('No accounts found')}
      />
    </SafeAreaView>
  );
}
