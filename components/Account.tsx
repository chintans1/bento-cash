import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { NewBrandingColours } from '../styles/brandingConstants';
import { AccountType, AppAccount } from '../models/lunchmoney/appModels';
import { formatAmountString } from '../data/formatBalance';

type AccountProps = {
  account: AppAccount;
};

const styles = StyleSheet.create({
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

const getAccountIcon = (type: AccountType): string => {
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
};

function AccountComponent({ account }: AccountProps) {
  const accountBalance = parseFloat(account.balance);
  const balanceString = formatAmountString(accountBalance);

  return (
    <TouchableOpacity disabled style={styles.accountItem}>
      <View
        style={[
          styles.accountIcon,
          { backgroundColor: NewBrandingColours.primary.main },
        ]}
      >
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
                accountBalance >= 0
                  ? NewBrandingColours.secondary.main
                  : NewBrandingColours.accent.red,
            },
          ]}
        >
          {balanceString}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default AccountComponent;
