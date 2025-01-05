import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { NewBrandingColours } from '../styles/brandingConstants';
import { AppTransaction } from '../models/lunchmoney/appModels';
import { formatAmountString } from '../data/formatBalance';

type TransactionProps = {
  transaction: AppTransaction;
};

const styles = StyleSheet.create({
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: NewBrandingColours.neutral.lightGray,
  },
  transactionMain: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '500',
    color: NewBrandingColours.text.primary,
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 14,
    color: NewBrandingColours.text.secondary,
    marginBottom: 2,
  },
  transactionAccount: {
    fontSize: 12,
    color: NewBrandingColours.text.muted,
  },
  transactionSecondary: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: NewBrandingColours.text.muted,
  },
  pendingTag: {
    fontSize: 10,
    color: NewBrandingColours.accent.orange,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: `${NewBrandingColours.accent.orange}20`,
    borderRadius: 4,
  },
  splitIcon: {
    marginTop: 2,
  },
});

const getCategoryName = (transaction: AppTransaction) => {
  return transaction.categoryName ? transaction.categoryName : 'Uncategorized';
};

const getAssetName = (transaction: AppTransaction) => {
  if (transaction.isGrouped) {
    return 'Grouped transaction';
  }

  return transaction.assetName ? transaction.assetName : 'unknown account';
};

// TODO: have a IconInfo, separate into different class with all the mappings
const getCategoryIcon = (category: string): string => {
  const lowerCaseCategory = category?.toLowerCase() || 'Uncategorized';

  if (
    lowerCaseCategory.includes('food') ||
    lowerCaseCategory.includes('drink')
  ) {
    return 'coffee';
  }
  if (lowerCaseCategory.includes('transportation')) {
    return 'truck';
  }
  if (lowerCaseCategory.includes('shopping')) {
    return 'shopping-bag';
  }
  if (
    lowerCaseCategory.includes('bills') ||
    lowerCaseCategory.includes('utilities')
  ) {
    return 'file-text';
  }
  if (lowerCaseCategory.includes('entertainment')) {
    return 'film';
  }
  if (
    lowerCaseCategory.includes('income') ||
    lowerCaseCategory.includes('deposit') ||
    lowerCaseCategory.includes('paycheck')
  ) {
    return 'dollar-sign';
  }
  if (lowerCaseCategory.includes('Uncategorized')) {
    return 'help-circle';
  }
  return 'help-circle';
};

const getCategoryColor = (category: string): string => {
  const lowerCaseCategory = category?.toLowerCase() || 'Uncategorized';

  if (
    lowerCaseCategory.includes('food') ||
    lowerCaseCategory.includes('drink')
  ) {
    return NewBrandingColours.accent.orange;
  }
  if (lowerCaseCategory.includes('transportation')) {
    return NewBrandingColours.primary.main;
  }
  if (lowerCaseCategory.includes('shopping')) {
    return NewBrandingColours.accent.purple;
  }
  if (
    lowerCaseCategory.includes('bills') ||
    lowerCaseCategory.includes('utilities')
  ) {
    return NewBrandingColours.accent.red;
  }
  if (lowerCaseCategory.includes('entertainment')) {
    return NewBrandingColours.accent.yellow;
  }
  if (
    lowerCaseCategory.includes('income') ||
    lowerCaseCategory.includes('deposit') ||
    lowerCaseCategory.includes('paycheck')
  ) {
    return NewBrandingColours.secondary.main;
  }
  if (lowerCaseCategory.includes('Uncategorized')) {
    return NewBrandingColours.accent.red;
  }
  return NewBrandingColours.neutral.gray;
};

function TransactionComponent({ transaction }: TransactionProps) {
  const transactionAmount = parseFloat(transaction.amount);
  const transactionAmountString = formatAmountString(
    transactionAmount,
    transaction.currency,
  );

  return (
    <TouchableOpacity disabled style={styles.transactionItem}>
      <View style={styles.transactionMain}>
        <View
          style={[
            styles.transactionIcon,
            { backgroundColor: getCategoryColor(transaction.categoryName) },
          ]}
        >
          <Icon
            name={getCategoryIcon(transaction.categoryName)}
            size={20}
            color={NewBrandingColours.neutral.white}
          />
        </View>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionName}>{transaction.payee}</Text>
          <Text style={styles.transactionCategory}>
            {getCategoryName(transaction)}
          </Text>
          <Text style={styles.transactionAccount}>
            {getAssetName(transaction)}
          </Text>
        </View>
      </View>
      <View style={styles.transactionSecondary}>
        <Text
          style={[
            styles.transactionAmount,
            {
              color:
                transactionAmount >= 0
                  ? NewBrandingColours.secondary.main
                  : NewBrandingColours.accent.red,
            },
          ]}
        >
          {transactionAmountString}
        </Text>
        <Text style={styles.transactionDate}>{transaction.date}</Text>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          {transaction.status === 'pending' && (
            <Text style={styles.pendingTag}>Pending</Text>
          )}
          {(transaction.status === 'uncleared' ||
            transaction.status === 'cleared') && (
            <Icon
              name="check-circle"
              size={14}
              color={
                transaction.status === 'uncleared'
                  ? NewBrandingColours.neutral.gray
                  : NewBrandingColours.secondary.main
              }
              style={styles.splitIcon}
            />
          )}
          {transaction.isSplit && (
            <Icon
              name="git-branch"
              size={14}
              color={NewBrandingColours.accent.purple}
              style={styles.splitIcon}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default TransactionComponent;
