import { StatusBar, StyleSheet } from 'react-native';
import { NewBrandingColours } from './brandingConstants';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NewBrandingColours.neutral.background,
    paddingTop: StatusBar.currentHeight,
  },
  content: {
    flex: 1,
    padding: 16,
  },

  // Common text styles
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: NewBrandingColours.text.primary,
  },

  card: {
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: NewBrandingColours.neutral.white,
    borderRadius: 8,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
    // elevation: 2,
  },

  // Common list styles
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: NewBrandingColours.neutral.lightGray,
  },
  listItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: NewBrandingColours.accent.orange,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  listItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: NewBrandingColours.text.primary,
  },
  listItemMemo: {
    fontSize: 14,
    color: NewBrandingColours.text.muted,
  },
});
