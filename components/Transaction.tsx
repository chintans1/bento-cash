import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import commonStyles from '../styles/commonStyles';
import BrandingColours from '../styles/brandingConstants';
import { AppTransaction } from '../models/lunchmoney/appModels';
import CategoryComponent from './Category';
import { formatAmountString } from '../data/formatBalance';

type TransactionProps = {
  transaction: AppTransaction;
};

const transactionStyles = StyleSheet.create({
  card: {
    ...commonStyles.card,
    borderWidth: 0,
    backgroundColor: BrandingColours.backgroundColour,
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
  transactionName: {
    flexWrap: 'wrap',
    flexShrink: 1,
    color: BrandingColours.darkTextColour,
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    ...commonStyles.textBase,
    color: 'grey',
    fontSize: 10,
  },
  account: {
    ...commonStyles.textBase,
    color: 'grey',
    fontSize: 10,
  },
  amount: {
    color: BrandingColours.secondaryColour,
    fontWeight: 'bold',
  },
  amountNegative: {
    color: BrandingColours.red,
  },
  amountPositive: {
    color: BrandingColours.green,
  },
});

const getAssetName = (transaction: AppTransaction) => {
  if (transaction.isGrouped) {
    return 'Grouped transaction';
  }

  return transaction.assetName ? transaction.assetName : 'unknown account';
};

function TransactionComponent({ transaction }: TransactionProps) {
  const transactionAmount = parseFloat(transaction.amount);
  const transactionAmountString = formatAmountString(transactionAmount);

  return (
    <View style={transactionStyles.card}>
      <View style={transactionStyles.leftSection}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={transactionStyles.transactionName}
          >
            {transaction.payee}
          </Text>

          {transaction.isSplit ? (
            <MaterialIcons
              style={{ marginLeft: 5 }}
              name="call-split"
              size={16}
              color={BrandingColours.secondaryColour}
            />
          ) : null}

          {transaction.status === 'pending' ? (
            <CategoryComponent categoryName="pending" />
          ) : null}

          <CategoryComponent categoryName={transaction.categoryName} />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={transactionStyles.account}>
            {getAssetName(transaction)}
          </Text>
        </View>
      </View>
      <View style={transactionStyles.rightSection}>
        <Text
          style={[
            transactionStyles.amount,
            transactionAmount >= 0
              ? transactionStyles.amountPositive
              : transactionStyles.amountNegative,
          ]}
        >
          {transactionAmountString}
        </Text>
        <Text style={transactionStyles.date}>{transaction.date}</Text>
      </View>
    </View>
  );
}

export default TransactionComponent;
