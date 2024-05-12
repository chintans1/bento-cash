import { View, Text, StyleSheet } from 'react-native';
import commonStyles from '../styles/commonStyles';
import BrandingColours from '../styles/brandingConstants';
import { AppAccount } from '../models/lunchmoney/appModels';

type AccountProps = {
  account: AppAccount;
  showInstitution?: boolean;
};

// borderStyle: "dotted", borderColor: "#000000", borderWidth: 1

const transactionStyles = StyleSheet.create({
  card: {
    ...commonStyles.card,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  leftSection: {
    flex: 3.5,
    flexDirection: 'column',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
    flexDirection: 'column',
  },
  institutionName: {
    ...commonStyles.textBase,
    color: BrandingColours.grey,
    fontSize: 10,
  },
  accountName: {
    flexWrap: 'wrap',
    flexShrink: 1,
    color: BrandingColours.darkTextColour,
    fontSize: 16,
    fontWeight: 'bold',
  },
  amount: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  amountNegative: {
    color: BrandingColours.red,
  },
  amountPositive: {
    color: BrandingColours.green,
  },
});

function AccountComponent({ account, showInstitution }: AccountProps) {
  const accountBalance = parseFloat(account.balance);
  const balanceString =
    accountBalance >= 0
      ? `$${accountBalance.toFixed(2)}`
      : `-$${Math.abs(accountBalance).toFixed(2)}`;

  return (
    <View style={transactionStyles.card}>
      <View style={transactionStyles.leftSection}>
        <Text
          adjustsFontSizeToFit
          numberOfLines={1}
          style={transactionStyles.accountName}
        >
          {account.accountName}
        </Text>
        {showInstitution ? (
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={transactionStyles.institutionName}
          >
            {account.institutionName}
          </Text>
        ) : null}
      </View>
      <View style={transactionStyles.rightSection}>
        <Text
          adjustsFontSizeToFit
          numberOfLines={1}
          style={[
            transactionStyles.amount,
            accountBalance >= 0
              ? transactionStyles.amountPositive
              : transactionStyles.amountNegative,
          ]}
        >
          {balanceString}
        </Text>
      </View>
    </View>
  );
}

export default AccountComponent;
