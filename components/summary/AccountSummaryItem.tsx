import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { NewBrandingColours } from '../../styles/brandingConstants';
import { formatAmountString } from '../../data/formatBalance';
import commonStyles from '../../styles/commonStyles';
import {
  AccountSummary,
  AccountSummaryType,
} from '../../models/bento/accountSummary';

type AccountSummaryItemProps = {
  accountSummary: AccountSummary;
  showTrend: boolean;
};

const styles = StyleSheet.create({
  accountInfo: {
    ...commonStyles.listItem,
  },
  accountInfoContainer: {
    ...commonStyles.listItemInfo,
  },
  accountIcon: {
    ...commonStyles.listItemIcon,
  },
  accountName: {
    ...commonStyles.listItemName,
  },
  accountBalance: {
    ...commonStyles.listItemMemo,
  },
  accountChange: {
    fontSize: 14,
    fontWeight: '500',
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

function AccountSummaryItem({
  accountSummary,
  showTrend,
}: AccountSummaryItemProps) {
  const { name, type, balance } = accountSummary;
  const iconInfo: IconInfo = getIcon(type);

  return (
    <View style={styles.accountInfo}>
      <View style={styles.accountInfoContainer}>
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
          <Text style={styles.accountName}>{name}</Text>
          <Text style={styles.accountBalance}>
            {formatAmountString(balance)}
          </Text>
        </View>
      </View>
      {/* TODO: use changeMonthOverMonth forreal} */}
      {showTrend ? (
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
      ) : null}
    </View>
  );
}

export default AccountSummaryItem;
