import { SectionList, StyleSheet, Text, View } from 'react-native';
import commonStyles from '../styles/commonStyles';
import { useParentContext } from '../context/app/appContextProvider';
import AccountComponent from '../components/Account';
import BrandingColours from '../styles/brandingConstants';
import { getGroupedAccountsByInstitution } from '../data/utils';
import { formatAmountString } from '../data/formatBalance';

const separator = () => {
  return (
    <View
      style={{
        borderBottomColor: BrandingColours.dividerColour,
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginHorizontal: 10,
      }}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    ...commonStyles.card,
    marginVertical: 0,
    flexDirection: 'column',
    flex: 0,
    borderRadius: 8,
    marginBottom: 10,
  },
  list: {
    ...commonStyles.list,
  },
  institutionName: {
    backgroundColor: BrandingColours.secondaryColour,
    color: BrandingColours.lightTextColour,
    fontWeight: 'bold',
    fontSize: 12,
    padding: 10,
  },
  amountNegative: {
    color: BrandingColours.red,
  },
  amountPositive: {
    color: BrandingColours.green,
  },
});

export default function Accounts() {
  const { accounts: accountsMap } = useParentContext().appState;
  const accounts = Array.from(accountsMap.values());
  const accountsByInstitution = getGroupedAccountsByInstitution(accounts);
  const netWorth = accounts
    .map(account => parseFloat(account.balance))
    .reduce((partialNw, balance) => partialNw + balance, 0);
  const netWorthString = formatAmountString(netWorth);

  return (
    <View style={[commonStyles.container, { flex: 1 }]}>
      <View style={styles.card}>
        <Text
          style={{
            color: BrandingColours.darkTextColour,
            fontSize: 20,
            fontWeight: 'bold',
          }}
        >
          Overview
        </Text>
        <Text style={{ color: BrandingColours.secondaryColour, fontSize: 16 }}>
          Net worth:{' '}
          <Text
            style={[
              netWorth >= 0 ? styles.amountPositive : styles.amountNegative,
              { fontWeight: 'bold' },
            ]}
          >
            {netWorthString}
          </Text>
        </Text>
      </View>

      <SectionList
        sections={accountsByInstitution}
        style={styles.list}
        ItemSeparatorComponent={separator}
        keyExtractor={account => account.id.toString()}
        renderSectionHeader={({ section: { title: institutionName } }) => (
          <Text style={styles.institutionName}>{institutionName}</Text>
        )}
        renderItem={({ item }) => <AccountComponent account={item} />}
      />
    </View>
  );
}
