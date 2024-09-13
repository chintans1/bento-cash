import { useState } from 'react';
import {
  Dimensions,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NewBrandingColours } from '../../styles/brandingConstants';
import commonStyles from '../../styles/commonStyles';
import { useParentContext } from '../../context/app/appContextProvider';
import { ImportStackParamList } from '../ImportStackScreen';
import {
  accountTypes,
  AppDraftAccount,
} from '../../models/lunchmoney/appModels';

const { height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
    paddingTop: 0,
  },
  content: {
    ...commonStyles.content,
  },
  headerTitle: {
    ...commonStyles.headerText,
    fontSize: 28,
    color: NewBrandingColours.text.primary,
    marginBottom: 4,
  },

  instructionText: {
    fontSize: 16,
    color: NewBrandingColours.text.secondary,
    marginBottom: 24,
  },
  accountItem: {
    backgroundColor: NewBrandingColours.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: NewBrandingColours.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bankName: {
    fontSize: 18,
    fontWeight: '600',
    color: NewBrandingColours.text.primary,
    marginBottom: 12,
  },
  accountNameInput: {
    fontSize: 16,
    color: NewBrandingColours.text.primary,
    borderBottomWidth: 1,
    borderBottomColor: NewBrandingColours.neutral.gray,
    paddingVertical: 8,
    marginBottom: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: NewBrandingColours.neutral.lightGray,
    borderRadius: 12,
    padding: 12,
  },
  categoryButtonText: {
    fontSize: 16,
    color: NewBrandingColours.text.primary,
  },
  saveButton: {
    backgroundColor: NewBrandingColours.primary.main,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: NewBrandingColours.neutral.white,
    fontSize: 18,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    maxHeight: screenHeight * 0.6,
    backgroundColor: NewBrandingColours.neutral.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 22,
    alignItems: 'stretch',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: NewBrandingColours.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  categoryScrollView: {
    maxHeight: screenHeight * 0.4,
  },
  categoryOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: NewBrandingColours.neutral.lightGray,
  },
  categoryOptionText: {
    fontSize: 18,
    color: NewBrandingColours.text.primary,
  },
  clearCategoryOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: NewBrandingColours.neutral.lightGray,
    marginTop: 8,
  },
  clearCategoryOptionText: {
    fontSize: 18,
    color: NewBrandingColours.accent.red,
    fontWeight: '500',
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

type AccountCustomizationNavigationProp = NativeStackNavigationProp<
  ImportStackParamList,
  'AccountCustomization'
>;
type AccountCustomizationRouteProp = RouteProp<
  ImportStackParamList,
  'AccountCustomization'
>;

interface AccountCustomizationProps {
  route: AccountCustomizationRouteProp;
  navigation: AccountCustomizationNavigationProp;
}

export default function AccountCustomizationScreen({
  route,
  navigation,
}: AccountCustomizationProps) {
  const accounts = Array.from(
    useParentContext().appState.accounts.values(),
  ).filter(account => account.state === 'open');

  const { selectedNewAccounts } = route.params;
  const [customizedAccounts, setCustomizedAccounts] =
    useState<AppDraftAccount[]>(selectedNewAccounts);

  const [accountModalVisible, setAccountModalVisible] =
    useState<boolean>(false);
  const [categoryModalVisible, setCategoryModalVisible] =
    useState<boolean>(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(null);

  const updateAccount = (id: string, fieldName: string, fieldValue) => {
    setCustomizedAccounts(prevAccounts =>
      prevAccounts.map(account =>
        account.externalAccountId === id
          ? { ...account, [fieldName]: fieldValue }
          : account,
      ),
    );
  };

  const openLinkAccountModal = (accountId: string) => {
    setSelectedAccountId(accountId);
    setAccountModalVisible(true);
  };

  const openCategoryModal = (accountId: string) => {
    setSelectedAccountId(accountId);
    setCategoryModalVisible(true);
  };

  const renderAccountItem = (account: AppDraftAccount) => (
    <View key={account.externalAccountId} style={styles.accountItem}>
      <Text style={styles.bankName}>{account.institutionName}</Text>
      <TextInput
        style={styles.accountNameInput}
        value={account.accountName}
        onChangeText={text =>
          updateAccount(account.externalAccountId, 'accountName', text)
        }
        placeholder="Account Name"
      />
      <TouchableOpacity
        style={[styles.categoryButton, { marginBottom: 16 }]}
        onPress={() => openCategoryModal(account.externalAccountId)}
      >
        <Text style={styles.categoryButtonText}>
          {account.type || 'Choose category'}
        </Text>
        <Icon
          name="chevron-down"
          size={20}
          color={NewBrandingColours.primary.main}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.categoryButton}
        onPress={() => openLinkAccountModal(account.externalAccountId)}
      >
        <Text style={styles.categoryButtonText}>
          {account.lmAccount?.accountName || 'Link to existing account'}
        </Text>
        <Icon
          name="chevron-down"
          size={20}
          color={NewBrandingColours.primary.main}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.headerTitle}>Customize New Accounts</Text>

        <Text style={styles.instructionText}>
          Optionally customize account names and link them to existing Lunch
          Money accounts before importing.
        </Text>

        {customizedAccounts.map(renderAccountItem)}

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => {
            // Handle saving customized accounts
            navigation.navigate('ImportSyncConfirmation', {
              ...route.params,
              selectedNewAccounts: customizedAccounts,
            });
          }}
        >
          <Text style={styles.saveButtonText}>Save and Continue</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent
        visible={accountModalVisible}
        onRequestClose={() => setAccountModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setAccountModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Link to existing accounts</Text>
              <ScrollView style={styles.categoryScrollView}>
                {accounts.map(account => (
                  <TouchableOpacity
                    key={account.id}
                    style={styles.categoryOption}
                    onPress={() => {
                      updateAccount(selectedAccountId, 'lmAccount', account);
                      setAccountModalVisible(false);
                    }}
                  >
                    <Text style={styles.categoryOptionText}>
                      {account.accountName} ({account.institutionName})
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.clearCategoryOption}
                onPress={() => {
                  updateAccount(selectedAccountId, 'lmAccount', null);
                  setAccountModalVisible(false);
                }}
              >
                <Text style={styles.clearCategoryOptionText}>
                  Clear Account
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setAccountModalVisible(false)}
              >
                <Text style={styles.closeModalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        animationType="slide"
        transparent
        visible={categoryModalVisible}
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <TouchableWithoutFeedback
          onPress={() => setCategoryModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select category of account</Text>
              <ScrollView style={styles.categoryScrollView}>
                {accountTypes.map(type => (
                  <TouchableOpacity
                    key={type}
                    style={styles.categoryOption}
                    onPress={() => {
                      updateAccount(selectedAccountId, 'type', type);
                      setCategoryModalVisible(false);
                    }}
                  >
                    <Text style={styles.categoryOptionText}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.clearCategoryOption}
                onPress={() => {
                  updateAccount(selectedAccountId, 'type', null);
                  setCategoryModalVisible(false);
                }}
              >
                <Text style={styles.clearCategoryOptionText}>
                  Clear Category
                </Text>
              </TouchableOpacity>
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
    </SafeAreaView>
  );
}
