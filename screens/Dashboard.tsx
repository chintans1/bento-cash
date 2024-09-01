import React, { useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useParentContext } from '../context/app/appContextProvider';
import { AppTransaction } from '../models/lunchmoney/appModels';
import { formatAmountString } from '../data/formatBalance';
import {
  AccountSummary,
  AccountSummaryType,
} from '../models/bento/accountSummary';
import { getAccountsSummary } from '../data/transformAccounts';
import { NewBrandingColours } from '../styles/brandingConstants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NewBrandingColours.neutral.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: NewBrandingColours.neutral.white,
    // borderBottomWidth: 1,
    // borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: NewBrandingColours.text.primary,
  },
  balanceCard: {
    margin: 16,
    padding: 16,
    backgroundColor: NewBrandingColours.primary.main,
    borderRadius: 12,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
    // elevation: 2,
  },
  balanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: NewBrandingColours.neutral.white,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: NewBrandingColours.neutral.white,
  },
  balanceChange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  balanceChangeText: {
    marginLeft: 4,
    fontSize: 14,
    color: NewBrandingColours.secondary.light,
    fontWeight: '500',
  },
  sectionCard: {
    margin: 16,
    backgroundColor: NewBrandingColours.neutral.white,
    borderRadius: 12,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
    // elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: NewBrandingColours.text.primary,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: NewBrandingColours.neutral.lightGray,
  },
  accountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: NewBrandingColours.neutral.lightGray,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '500',
    color: NewBrandingColours.text.primary,
  },
  accountBalance: {
    fontSize: 14,
    color: NewBrandingColours.text.muted,
  },
  accountChange: {
    fontSize: 14,
    fontWeight: '500',
  },
  addAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    // borderTopWidth: 1,
    // borderTopColor: '#E2E8F0',
  },
  addAccountText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: NewBrandingColours.primary.main,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: NewBrandingColours.neutral.lightGray,
  },
  transactionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: NewBrandingColours.accent.orange,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '500',
    color: NewBrandingColours.text.primary,
  },
  transactionDate: {
    fontSize: 14,
    color: NewBrandingColours.text.muted,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
  },
  transactionCategory: {
    fontSize: 14,
    color: NewBrandingColours.text.muted,
    textAlign: 'right',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    // borderTopWidth: 1,
    // borderTopColor: '#E2E8F0',
  },
  viewAllText: {
    marginRight: 4,
    fontSize: 16,
    fontWeight: '600',
    color: NewBrandingColours.primary.main,
  },
});

type IconInfo = {
  iconColour: string;
  iconName: string;
};

const getIcon = (accountType: AccountSummaryType): IconInfo => {
  switch (accountType) {
    case 'checking':
      return {
        iconName: 'briefcase',
        iconColour: NewBrandingColours.secondary.main,
      };
    case 'investment':
      return {
        iconName: 'dollar-sign',
        iconColour: NewBrandingColours.accent.purple,
      };
    case 'debt':
      return {
        iconName: 'credit-card',
        iconColour: NewBrandingColours.accent.red,
      };
    case 'unknown':
    default:
      return { iconName: 'box', iconColour: NewBrandingColours.neutral.gray };
  }
};

const renderAccount = (account: AccountSummary) => {
  const iconInfo: IconInfo = getIcon(account.type);

  return (
    <View style={styles.accountItem}>
      <View style={styles.accountInfo}>
        <View
          style={[styles.accountIcon, { backgroundColor: iconInfo.iconColour }]}
        >
          <Icon
            name={iconInfo.iconName}
            size={20}
            color={NewBrandingColours.neutral.white}
          />
        </View>
        <View>
          <Text style={styles.accountName}>{account.name}</Text>
          <Text style={styles.accountBalance}>
            {formatAmountString(account.balance)}
          </Text>
        </View>
      </View>
      <Text
        style={[
          styles.accountChange,
          {
            color: '+2.3'?.startsWith('+')
              ? NewBrandingColours.secondary.main
              : NewBrandingColours.accent.red,
          },
        ]}
      >
        +2.3%
      </Text>
    </View>
  );
};

const renderTransaction = (transaction: AppTransaction) => {
  const { payee, date, amount, categoryName } = transaction;

  return (
    <View style={styles.transactionItem}>
      <View style={styles.transactionInfo}>
        <View style={styles.transactionIcon}>
          <Icon
            name="pie-chart"
            size={20}
            color={NewBrandingColours.neutral.white}
          />
        </View>
        <View>
          <Text style={styles.transactionName}>{payee}</Text>
          <Text style={styles.transactionDate}>{date}</Text>
        </View>
      </View>
      <View>
        <Text
          style={[
            styles.transactionAmount,
            {
              color:
                parseFloat(amount) >= 0
                  ? NewBrandingColours.secondary.main
                  : NewBrandingColours.accent.red,
            },
          ]}
        >
          {formatAmountString(amount)}
        </Text>
        <Text style={styles.transactionCategory}>{categoryName}</Text>
      </View>
    </View>
  );
};

export default function Dashboard({ navigation }) {
  // TODO: gather networth
  const { transactions, accounts: accountsMap } =
    useParentContext()?.appState ?? {};
  const recentTransactions =
    transactions.length > 3 ? transactions.slice(0, 3) : transactions;

  const accounts: AccountSummary[] = useMemo(
    () => getAccountsSummary(accountsMap),
    [accountsMap],
  );

  return (
    <ScrollView style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="bell" size={24} color="#4A5568" />
        </TouchableOpacity>
      </View> */}

      <View style={styles.balanceCard}>
        <Text style={styles.balanceTitle}>Total Balance</Text>
        <Text style={styles.balanceAmount}>$12,750.32</Text>
        <View style={styles.balanceChange}>
          <Icon
            name="arrow-up-right"
            size={16}
            color={NewBrandingColours.secondary.main}
          />
          <Text style={styles.balanceChangeText}>+2.5% from last month</Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Accounts Summary</Text>
        <FlatList
          data={accounts}
          renderItem={({ item }) => renderAccount(item)}
          // TODO: need to support empty component here
        />
        <TouchableOpacity
          style={styles.addAccountButton}
          onPress={() => navigation.navigate('ChooseImportMethod')}
        >
          <Text style={styles.addAccountText}>View Accounts</Text>
          <Icon
            name="chevron-right"
            size={20}
            color={NewBrandingColours.primary.main}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <FlatList
          data={recentTransactions}
          renderItem={({ item }) => renderTransaction(item)}
        />
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All Transactions</Text>
          <Icon
            name="chevron-right"
            size={16}
            color={NewBrandingColours.primary.main}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
