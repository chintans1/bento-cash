import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import commonStyles from '../../styles/commonStyles';
import { NewBrandingColours } from '../../styles/brandingConstants';
import { ImportStackParamList } from '../ImportStackScreen';

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
  },
  content: {
    ...commonStyles.content,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    ...commonStyles.headerText,
    fontSize: 28,
    color: NewBrandingColours.text.primary,
    flex: 1,
  },
  backButton: {
    // padding: 8,
    marginRight: 8,
  },

  importMethodList: {
    paddingTop: 8,
  },
  importMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NewBrandingColours.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    // shadowColor: NewBrandingColours.neutral.black,
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
  },
  importMethodItemDisabled: {
    opacity: 0.4,
  },

  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },

  importMethodText: {
    fontSize: 18,
    fontWeight: '600',
    color: NewBrandingColours.text.primary,
    marginBottom: 4,
  },
  importMethodTextDisabled: {
    color: NewBrandingColours.text.muted,
  },
  comingSoonText: {
    fontSize: 14,
    color: NewBrandingColours.accent.orange,
  },
  chevron: {
    marginLeft: 8,
  },
});

type ImportMethodSelectionNavigationProp = NativeStackNavigationProp<
  ImportStackParamList,
  'ImportMethodSelection'
>;

interface ImportMethodSelectionProps {
  navigation: ImportMethodSelectionNavigationProp;
}

export default function ImportMethodSelectionScreen({
  navigation,
}: ImportMethodSelectionProps) {
  // TODO: have another class to fetch supported import methods, use type safety
  const importMethods = [
    {
      id: 'simplefin',
      name: 'SimpleFIN',
      icon: 'cloud',
      color: NewBrandingColours.primary.main,
      navigateScreen: 'SimpleFinConnection',
    },
    {
      id: 'apple-card',
      name: 'Apple Card',
      icon: 'smartphone',
      color: NewBrandingColours.accent.purple,
      disabled: true,
    },
  ];

  const renderImportMethod = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.importMethodItem,
        item.disabled && styles.importMethodItemDisabled,
      ]}
      onPress={() => !item.disabled && navigation.navigate(item.navigateScreen)}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
        <Icon
          name={item.icon}
          size={32}
          color={NewBrandingColours.neutral.white}
        />
      </View>
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.importMethodText,
            item.disabled && styles.importMethodTextDisabled,
          ]}
        >
          {item.name}
        </Text>
        {item.disabled && (
          <Text style={styles.comingSoonText}>Coming Soon</Text>
        )}
      </View>
      {!item.disabled && (
        <Icon
          name="chevron-right"
          size={24}
          color={NewBrandingColours.neutral.gray}
          style={styles.chevron}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon
              name="arrow-left"
              size={24}
              color={NewBrandingColours.text.primary}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Import Method</Text>
        </View>
        <FlatList
          data={importMethods}
          renderItem={renderImportMethod}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.importMethodList}
        />
      </View>
    </SafeAreaView>
  );
}
