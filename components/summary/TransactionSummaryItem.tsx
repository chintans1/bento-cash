import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { AppTransaction } from '../../models/lunchmoney/appModels';
import { NewBrandingColours } from '../../styles/brandingConstants';
import { formatAmountString } from '../../data/formatBalance';
import commonStyles from '../../styles/commonStyles';

type TransactionSummaryProps = {
  transaction: AppTransaction;
};

const styles = StyleSheet.create({
  transactionItem: {
    ...commonStyles.listItem,
  },

  transactionInfoContainer: {
    ...commonStyles.listItemInfo,
    flex: 1,
  },
  transactionIcon: {
    ...commonStyles.listItemIcon,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    ...commonStyles.listItemName,
  },
  transactionDate: {
    ...commonStyles.listItemMemo,
  },

  transactionAmountContainer: {
    alignItems: 'flex-end',
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
});

function TransactionSummaryItem({ transaction }: TransactionSummaryProps) {
  const { payee, date, amount, categoryName } = transaction;

  return (
    <View style={styles.transactionItem}>
      <View style={styles.transactionInfoContainer}>
        <View style={styles.transactionIcon}>
          <Icon
            name="pie-chart"
            size={20}
            color={NewBrandingColours.neutral.white}
          />
        </View>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionName}>{payee}</Text>
          <Text style={styles.transactionDate}>{date}</Text>
        </View>
      </View>
      <View style={styles.transactionAmountContainer}>
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
          {formatAmountString(amount, transaction.currency)}
        </Text>
        <Text style={styles.transactionCategory}>{categoryName}</Text>
      </View>
    </View>
  );
}

export default TransactionSummaryItem;
