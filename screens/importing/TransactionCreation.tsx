import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import { useEffect, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import commonStyles from '../../styles/commonStyles';
import { NewBrandingColours } from '../../styles/brandingConstants';
import { useParentContext } from '../../context/app/appContextProvider';
import InternalLunchMoneyClient from '../../clients/lunchMoneyClient';
import { getDraftTransactions } from '../../data/transformLunchMoney';
import { ImportStackParamList } from '../ImportStackScreen';

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
  },
  content: {
    ...commonStyles.content,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: NewBrandingColours.text.muted,
    fontSize: 14,
    paddingTop: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: NewBrandingColours.text.secondary,
    textAlign: 'center',
    marginTop: 16,
  },
});

type TransactionCreationNavigationProp = NativeStackNavigationProp<
  ImportStackParamList,
  'TransactionCreation'
>;
type TransactionCreationRouteProp = RouteProp<
  ImportStackParamList,
  'TransactionCreation'
>;

interface TransactionCreationProps {
  route: TransactionCreationRouteProp;
  navigation: TransactionCreationNavigationProp;
}

export default function TransactionCreationScreen({
  route,
  navigation,
}: TransactionCreationProps) {
  const { lmApiKey } = useParentContext().appState;
  const lunchMoneyClient = new InternalLunchMoneyClient({ token: lmApiKey });

  const { selectedTransactions } = route.params;

  const [isCreating, setIsCreating] = useState<boolean>(true);

  const createTransactions = async () => {
    if (selectedTransactions.length == 0) {
      navigation.replace('Completion');
      return;
    }

    const draftTransactions = getDraftTransactions(
      Array.from(selectedTransactions.values()),
    );

    lunchMoneyClient
      .createTransactions(draftTransactions)
      .then(() => navigation.replace('Completion'))
      .catch(() => setIsCreating(false));
  };

  useEffect(() => {
    createTransactions();
  }, [createTransactions]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {isCreating ? (
          <View>
            <ActivityIndicator
              size="large"
              color={NewBrandingColours.neutral.black}
            />
            <Text style={styles.loadingText}>Creating transactions...</Text>
          </View>
        ) : (
          <Text style={styles.errorMessage}>
            Failed to create transactions, please try again later.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}
