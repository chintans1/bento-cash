import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useParentContext } from '../context/app/appContextProvider';
import { formatAmountString } from '../data/formatBalance';
import { AppAccount } from '../models/lunchmoney/appModels';
import { NewBrandingColours } from '../styles/brandingConstants';
import AccountComponent from '../components/Account';
import renderNoStateMessage from '../components/EmptyListComponent';
import Icon from 'react-native-vector-icons/Feather';

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

  chartContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: NewBrandingColours.text.secondary,
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

  const [expandedSections, setExpandedSections] = useState<string[]>(
    accounts
      .map(account => account.institutionName)
      .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
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

  const toggleSection = (institution: string) => {
    setExpandedSections(prev =>
      prev.includes(institution)
        ? prev.filter(i => i !== institution)
        : [...prev, institution]
    );
  };

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
    <TouchableOpacity
      style={styles.sectionHeader}
      onPress={() => toggleSection(institution)}
    >
      <Text style={styles.sectionHeaderText}>{institution}</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.sectionHeaderBalance}>
          {formatAmountString(totalBalance)}
        </Text>
        <Icon
          name={expandedSections.includes(institution) ? 'chevron-down' : 'chevron-up'}
          size={20}
          color={NewBrandingColours.text.secondary}
          style={{ marginLeft: 8 }}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={groupedAccounts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item, section }) =>
          expandedSections.includes(section.institution) ? (
            <AccountComponent account={item} />
          ) : null
        }
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={renderListHeaderComponent}
        contentContainerStyle={styles.accountList}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={renderNoStateMessage('No accounts found')}
      />
    </SafeAreaView>
  );
}
