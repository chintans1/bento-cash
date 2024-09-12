import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
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
import { useParentContext } from '../context/app/appContextProvider';
import InternalLunchMoneyClient from '../clients/lunchMoneyClient';
import { AppLunchMoneyInfo } from '../models/lunchmoney/appModels';
import { NewBrandingColours } from '../styles/brandingConstants';
import { getClaimUrl, storeSimpleFinAuth } from '../clients/simplefinClient';
import {
  isAuthPresent,
  storeAuthenticationDetails,
} from '../utils/simpleFinAuth';
import accessClient from '../clients/accessClient';
import commonStyles from '../styles/commonStyles';

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
  },
  content: {
    ...commonStyles.content,
    flex: 0,
  },

  headerTitle: {
    ...commonStyles.headerText,
    paddingStart: 16,
    paddingTop: 4,
    fontSize: 28,
    fontWeight: 'bold',
    color: NewBrandingColours.text.primary,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: NewBrandingColours.text.primary,
    marginBottom: 12,
  },

  budgetInfoCard: {
    backgroundColor: NewBrandingColours.neutral.white,
    borderRadius: 12,
    overflow: 'hidden',
    // padding: 16,
    // shadowColor: NewBrandingColours.neutral.black,
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
  },
  budgetInfoHeader: {
    backgroundColor: NewBrandingColours.primary.main,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  budgetInfoHeaderText: {
    color: NewBrandingColours.neutral.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  budgetInfoContent: {
    padding: 16,
  },
  budgetInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    // borderBottomWidth: 1,
    // borderBottomColor: NewBrandingColours.neutral.lightGray,
  },

  infoLabel: {
    fontSize: 16,
    color: NewBrandingColours.text.secondary,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: NewBrandingColours.text.primary,
  },

  input: {
    backgroundColor: NewBrandingColours.neutral.white,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: NewBrandingColours.primary.main,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: NewBrandingColours.neutral.white,
    fontSize: 16,
    fontWeight: '600',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function Settings({ navigation }) {
  const { appState, updateLunchMoneyToken } = useParentContext();
  const { lmApiKey } = appState;

  const lunchMoneyClient = useMemo(
    () => new InternalLunchMoneyClient({ token: lmApiKey }),
    [lmApiKey],
  );

  // Used for component data
  const [userInfo, setUserInfo] = useState<AppLunchMoneyInfo | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Text input state fields
  const [newLmApiKey, setNewLmApiKey] = useState<string>('');
  const [simpleFinToken, setSimpleFinToken] = useState<string>('');
  const [simpleFinTokenExists, setSimpleFinTokenExists] =
    useState<boolean>(false);

  const [simpleFinInSetup, setSimpleFinInSetup] = useState(false);

  const getUserInfo = useCallback(async () => {
    if (lmApiKey != null && !isReady) {
      setUserInfo(await lunchMoneyClient.getLunchMoneyInfo());
    }
  }, [isReady, lmApiKey, lunchMoneyClient]);

  const checkForSimpleFinAuth = useCallback(async () => {
    if (!isReady) {
      setSimpleFinTokenExists(await isAuthPresent());
    }
  }, [isReady]);

  const handleUpdateLmApiKey = async () => {
    try {
      const isValidKey = await accessClient.isTokenValid(newLmApiKey);

      if (!isValidKey) {
        throw Error();
      }

      const newUserInfo = await accessClient.getTokenInfo(newLmApiKey);
      Alert.alert(
        'Verify new budget',
        `Are you sure you want to load budget "${newUserInfo.budgetName}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Confirm',
            onPress: () => {
              updateLunchMoneyToken(newLmApiKey);
              setUserInfo(newUserInfo);
              setNewLmApiKey('');
              Alert.alert('Success', 'New budget has been loaded.');
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to verify the new API key. Please make sure the token is valid.',
      );
    }
  };

  const handleSetupSimpleFin = async () => {
    setSimpleFinInSetup(true);
    try {
      const claimUrl = getClaimUrl(simpleFinToken);
      const simpleFinAuthDetails = await storeSimpleFinAuth(claimUrl);

      Alert.alert(
        'Confirm SimpleFIN Setup',
        simpleFinTokenExists
          ? 'Are you sure you want to override the existing SimpleFIN auth?'
          : 'Are you sure you want to set SimpleFIN auth?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => setSimpleFinInSetup(false),
          },
          {
            text: 'Confirm',
            onPress: () => {
              storeAuthenticationDetails(simpleFinAuthDetails);
              setSimpleFinToken('');
              setSimpleFinTokenExists(true);
              setSimpleFinInSetup(false);
              Alert.alert('Success', 'SimpleFIN auth has been saved.');
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to parse the given token. Please ensure it is correct.',
      );
      setSimpleFinInSetup(false);
    }
  };

  useEffect(() => {
    checkForSimpleFinAuth();
    getUserInfo();
    setIsReady(true);
  }, [checkForSimpleFinAuth, getUserInfo]);

  /*
    TODO
      - allow update of LM API token (reloads state completely)
      - store setup token for SimpleFin
      - from that, we can fetch the access URL and store it
      - with access URL details stored, we can always fetch for new updates from accounts on demand
  */

  if (!isReady) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        style={styles.container}
      >
        <SafeAreaView>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.content}>
            <ScrollView>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Budget Information</Text>
                <View style={styles.budgetInfoCard}>
                  <View style={styles.budgetInfoHeader}>
                    <Icon
                      name="user"
                      size={24}
                      color={NewBrandingColours.neutral.white}
                    />
                    <Text style={styles.budgetInfoHeaderText}>
                      {userInfo?.userName || 'John Doe'}
                    </Text>
                  </View>
                  <View style={styles.budgetInfoContent}>
                    <View style={styles.budgetInfoRow}>
                      <Text style={styles.infoLabel}>Budget:</Text>
                      <Text style={styles.infoValue}>
                        {userInfo?.budgetName || 'Unknown'}
                      </Text>
                    </View>
                    <View style={styles.budgetInfoRow}>
                      <Text style={styles.infoLabel}>Currency:</Text>
                      <Text style={styles.infoValue}>
                        {userInfo?.primaryCurrency || 'Unknown'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Lunch Money API Token</Text>
                <TextInput
                  style={styles.input}
                  secureTextEntry
                  placeholder="Enter new API token"
                  value={newLmApiKey}
                  onChangeText={setNewLmApiKey}
                />
                <TouchableOpacity
                  style={[styles.button, !newLmApiKey && styles.buttonDisabled]}
                  onPress={handleUpdateLmApiKey}
                  disabled={!newLmApiKey}
                >
                  <Text style={styles.buttonText}>Update API Token</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>SimpleFIN Setup</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter SimpleFIN setup token"
                  value={simpleFinToken}
                  onChangeText={setSimpleFinToken}
                />
                <TouchableOpacity
                  style={[
                    styles.button,
                    !simpleFinToken && styles.buttonDisabled,
                  ]}
                  onPress={handleSetupSimpleFin}
                  disabled={!simpleFinToken}
                >
                  <Text style={styles.buttonText}>
                    {simpleFinTokenExists
                      ? 'Update SimpleFIN Token'
                      : 'Set SimpleFIN Token'}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[
                  styles.button,
                  !simpleFinTokenExists && styles.buttonDisabled,
                ]}
                onPress={() => navigation.navigate('SimpleFinImport')}
                disabled={!simpleFinTokenExists}
              >
                <Text style={styles.buttonText}>
                  Import / Sync into Lunch Money
                </Text>
              </TouchableOpacity>
            </ScrollView>
            {simpleFinInSetup && (
              <View style={styles.overlay}>
                <ActivityIndicator
                  size="large"
                  color={NewBrandingColours.primary.main}
                />
              </View>
            )}
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
