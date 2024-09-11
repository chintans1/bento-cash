import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NewBrandingColours } from '../../styles/brandingConstants';
import commonStyles from '../../styles/commonStyles';
import { ImportStackParamList } from '../ImportStackScreen';

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
  },
  content: {
    ...commonStyles.content,
    justifyContent: 'space-between',
  },
  body: {
    flex: 1,
  },

  headerTitle: {
    ...commonStyles.headerText,
    fontSize: 28,
    color: NewBrandingColours.text.primary,
    marginBottom: 4,
  },

  completionIcon: {
    alignSelf: 'center',
    marginVertical: 24,
  },
  completionText: {
    fontSize: 18,
    color: NewBrandingColours.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },

  viewAccountsButton: {
    backgroundColor: NewBrandingColours.primary.main,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAccountsButtonText: {
    color: NewBrandingColours.neutral.white,
    fontSize: 18,
    fontWeight: '600',
  },
  returnButton: {
    backgroundColor: NewBrandingColours.neutral.lightGray,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  returnButtonText: {
    color: NewBrandingColours.text.primary,
    fontSize: 18,
    fontWeight: '600',
  },
});

type CompletionNavigationProp = NativeStackNavigationProp<
  ImportStackParamList,
  'Completion'
>;

interface CompletionProps {
  navigation: CompletionNavigationProp;
}

export default function CompletionScreen({ navigation }: CompletionProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.headerTitle}>Import Complete</Text>

        <View>
          <Icon
            name="check-circle"
            size={64}
            color={NewBrandingColours.secondary.main}
            style={styles.completionIcon}
          />
          <Text style={styles.completionText}>
            Your accounts and transactions have been successfully imported.
          </Text>
        </View>

        <View>
          {/* <TouchableOpacity
            style={styles.viewAccountsButton}
            onPress={() => navigation.navigate('SettingsScreen', { screen: 'Accounts' })}
          >
            <Text style={styles.viewAccountsButtonText}>View Updated Accounts</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.returnButton}
            onPress={() => navigation.getParent()?.goBack()}
          >
            <Text style={styles.returnButtonText}>Return to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
