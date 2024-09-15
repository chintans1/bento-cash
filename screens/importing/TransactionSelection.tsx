import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { NewBrandingColours } from '../../styles/brandingConstants';
import commonStyles from '../../styles/commonStyles';
import { ImportStackParamList } from '../ImportStackScreen';
import {
  AppCategory,
  AppDraftTransaction,
} from '../../models/lunchmoney/appModels';
import { formatAmountString } from '../../data/formatBalance';

import { getGroupedDraftTransactionsByAccount } from '../../data/utils';
import { getLastImportDate, storeLastImportDate } from '../../storage/importDate';
import { getParsedTransactions } from '../../data/transformSimpleFin';
import { getSimpleFinAuth } from '../../utils/simpleFinAuth';
import { getAccountsData } from '../../clients/simplefinClient';
import { useParentContext } from '../../context/app/appContextProvider';
import renderNoStateMessage from '../../components/EmptyListComponent';

const { height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
  },
  content: {
    ...commonStyles.content,
  },

  header: {
    padding: 16,
    backgroundColor: NewBrandingColours.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: NewBrandingColours.neutral.lightGray,
  },
  headerTitle: {
    ...commonStyles.headerText,
    fontSize: 28,
    color: NewBrandingColours.text.primary,
    marginBottom: 4,
  },

  headerSubtitle: {
    fontSize: 16,
    color: NewBrandingColours.text.secondary,
  },

  dateFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NewBrandingColours.neutral.lightGray,
    borderRadius: 12,
    padding: 12,
  },
  dateFilterIcon: {
    marginRight: 8,
  },
  dateFilterText: {
    flex: 1,
    fontSize: 16,
    color: NewBrandingColours.text.primary,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NewBrandingColours.neutral.lightGray,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: NewBrandingColours.text.secondary,
  },

  transactionList: {
    flexGrow: 1,
    paddingTop: 8,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NewBrandingColours.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDate: {
    fontSize: 14,
    color: NewBrandingColours.text.secondary,
    marginBottom: 4,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '500',
    color: NewBrandingColours.text.primary,
    marginBottom: 4,
  },
  transactionNotes: {
    fontSize: 14,
    color: NewBrandingColours.text.muted,
    marginBottom: 4,
  },

  categoryButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: NewBrandingColours.neutral.lightGray,
    borderRadius: 12,
    padding: 12,
  },

  transactionAmount: {
    marginRight: 16,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
  },
  positiveAmount: {
    color: NewBrandingColours.secondary.main,
  },
  negativeAmount: {
    color: NewBrandingColours.accent.red,
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectedIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: NewBrandingColours.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unselectedIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: NewBrandingColours.neutral.gray,
  },

  footer: {
  },
  continueButton: {
    backgroundColor: NewBrandingColours.primary.main,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    color: NewBrandingColours.neutral.white,
    fontSize: 18,
    fontWeight: '600',
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: NewBrandingColours.neutral.white,
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: NewBrandingColours.text.primary,
    marginBottom: 16,
  },
  datePicker: {
    width: 320,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: NewBrandingColours.neutral.lightGray,
    marginRight: 8,
  },
  applyButton: {
    backgroundColor: NewBrandingColours.primary.main,
    marginLeft: 8,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  applyButtonText: {
    color: NewBrandingColours.neutral.white,
  },

  loadingText: {
    color: NewBrandingColours.text.muted,
    fontSize: 14,
    paddingTop: 8,
  },

  // Modal for category choice
  categoryModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  categoryModalContent: {
    maxHeight: screenHeight * 0.6,
    backgroundColor: NewBrandingColours.neutral.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 22,
    alignItems: 'stretch',
  },
  categoryModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: NewBrandingColours.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  categoryItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: NewBrandingColours.neutral.lightGray,
  },
  categoryText: {
    fontSize: 16,
    color: NewBrandingColours.text.primary,
  },
  closeModalButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeModalButtonText: {
    fontSize: 18,
    color: NewBrandingColours.primary.main,
    fontWeight: '600',
  },
});

type TransactionSelectionNavigationProp = NativeStackNavigationProp<
  ImportStackParamList,
  'TransactionSelection'
>;
type TransactionSelectionRouteProp = RouteProp<
  ImportStackParamList,
  'TransactionSelection'
>;

interface TransactionSelectionProps {
  route: TransactionSelectionRouteProp;
  navigation: TransactionSelectionNavigationProp;
}

export default function TransactionSelectionScreen({
  route,
  navigation,
}: TransactionSelectionProps) {
  const { transactionsToImport } = route.params;
  const { categories } = useParentContext().appState;

  const [transactions, setTransactions] =
    useState<AppDraftTransaction[]>(transactionsToImport);
  const [selectedTransactions, setSelectedTransactions] = useState<
    Record<string, AppDraftTransaction>
  >({});

  const [filterDate, setFilterDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filterDateManuallyChanged, setFilterDateManuallyChanged] =
    useState<boolean>(false);

  const filteredTransactions = useMemo(
    () => getGroupedDraftTransactionsByAccount(transactions),
    [transactions],
  );

  const hydrateFilterDate = useCallback(async () => {
    const lastImportDate = await getLastImportDate();

    setFilterDate(lastImportDate);
  }, []);

  const toggleTransactionSelection = (transaction: AppDraftTransaction) => {
    setSelectedTransactions(prev => {
      const newSelected = { ...prev };

      if (newSelected[transaction.externalId]) {
        delete newSelected[transaction.externalId];
      } else {
        newSelected[transaction.externalId] = transaction;
      }
      return newSelected;
    });
  };

  const handleDateChange = useCallback(async () => {
    // TODO: we should get simplefinAuth from global state
    console.log('should not trigger unless date is changed by user');
    await storeLastImportDate(filterDate);

    const parsedTransactions = getParsedTransactions(
      await getAccountsData(await getSimpleFinAuth(), filterDate),
    );
    setTransactions(parsedTransactions);
    setFilterDateManuallyChanged(false);
  }, [filterDate]);

  const renderTransaction = (transaction: AppDraftTransaction) => {
    const [categoryModalVisible, setCategoryModalVisible] =
      useState<boolean>(false);

    const parsedAmount: number = parseFloat(transaction.amount);
    const transactionAmountString = formatAmountString(parsedAmount);

    const handleCategoryChange = (category: AppCategory) => {
      transaction.categoryId = category.id;
      transaction.categoryName = category.name;
      setCategoryModalVisible(false);
    };

    return (
      <TouchableOpacity
        style={styles.transactionItem}
        onPress={() => toggleTransactionSelection(transaction)}
      >
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionDate}>{transaction.date}</Text>
          <Text style={styles.transactionName}>{transaction.payee}</Text>
          {transaction.notes ? (
            <Text style={styles.transactionNotes}>{transaction.notes}</Text>
          ) : null}
          <TouchableOpacity onPress={() => setCategoryModalVisible(true)}>
            <Text style={styles.transactionNotes}>
              {transaction.categoryName || 'Uncategorized'}{' '}
              <Icon
                name="chevron-down"
                size={14}
                color={NewBrandingColours.text.muted}
              />
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.transactionAmount}>
          <Text
            style={[
              styles.amountText,
              parsedAmount >= 0 ? styles.positiveAmount : styles.negativeAmount,
            ]}
          >
            {transactionAmountString}
          </Text>
        </View>
        <View style={styles.checkboxContainer}>
          {selectedTransactions[transaction.externalId] ? (
            <View style={styles.selectedIcon}>
              <Icon
                name="check"
                size={24}
                color={NewBrandingColours.neutral.white}
              />
            </View>
          ) : (
            <View style={styles.unselectedIcon} />
          )}
        </View>

        <Modal
          animationType="slide"
          transparent
          visible={categoryModalVisible}
          onRequestClose={() => setCategoryModalVisible(false)}
        >
          <TouchableWithoutFeedback
            onPress={() => setCategoryModalVisible(false)}
          >
            <View style={styles.categoryModalContainer}>
              <View style={styles.categoryModalContent}>
                <Text style={styles.modalTitle}>Select Category</Text>
                <FlatList
                  data={categories}
                  renderItem={({ item: category }) => (
                    <TouchableOpacity
                      style={styles.categoryItem}
                      onPress={() => handleCategoryChange(category)}
                    >
                      <Text style={styles.categoryText}>{category.name}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={item => item.id.toString()}
                />
                <TouchableOpacity
                  style={styles.closeModalButton}
                  onPress={() => setCategoryModalVisible(false)}
                >
                  <Text style={styles.closeModalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({ section: { title: accountName } }) => {
    return (
      <TouchableOpacity disabled>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>{accountName}</Text>
          {/* <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Icon
              name="chevron-down"
              size={18}
              color={NewBrandingColours.text.secondary}
            />
          </View> */}
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    hydrateFilterDate();
  }, [hydrateFilterDate]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (filterDateManuallyChanged) {
        await handleDateChange(); // Call the memoized handleDateChange when filterDate changes
      }
    };

    fetchTransactions(); // Make sure this is an async function call
  }, [filterDate, handleDateChange, filterDateManuallyChanged]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.headerTitle}>Select Transactions</Text>

        <TouchableOpacity
          style={styles.dateFilterButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Icon
            name="calendar"
            size={20}
            color={NewBrandingColours.primary.main}
            style={styles.dateFilterIcon}
          />
          <Text style={styles.dateFilterText}>
            From: {filterDate.toDateString()}
          </Text>
          <Icon
            name="chevron-down"
            size={20}
            color={NewBrandingColours.primary.main}
          />
        </TouchableOpacity>

        {/* <Text style={styles.headerSubtitle}>Choose transactions to import or sync</Text> */}
        {filterDateManuallyChanged ? (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <ActivityIndicator
              size="large"
              color={NewBrandingColours.neutral.black}
            />
            <Text style={styles.loadingText}>Loading transactions...</Text>
          </View>
        ) : (
          <SectionList
            sections={filteredTransactions}
            renderItem={({ item }) => renderTransaction(item)}
            renderSectionHeader={renderSectionHeader}
            keyExtractor={item => item.externalId}
            contentContainerStyle={styles.transactionList}
            ListEmptyComponent={renderNoStateMessage('No transactions found')}
          />
        )}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.continueButton}
            disabled={filterDateManuallyChanged}
            onPress={() => {
              navigation.navigate('TransactionCreation', {
                selectedTransactions: Object.values(selectedTransactions),
              });
            }}
          >
            <Text style={styles.continueButtonText}>Import Transactions</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        transparent
        visible={showDatePicker}
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Start Date</Text>
            <RNDateTimePicker
              value={filterDate}
              themeVariant="light"
              textColor={NewBrandingColours.text.primary}
              mode="date"
              display="spinner"
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setFilterDate(selectedDate);
                }
              }}
              style={styles.datePicker}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.applyButton]}
                onPress={() => {
                  setShowDatePicker(false);
                  setFilterDateManuallyChanged(true);
                }}
              >
                <Text style={[styles.modalButtonText, styles.applyButtonText]}>
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
