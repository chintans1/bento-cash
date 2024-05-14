import { StyleSheet } from 'react-native';
import BrandingColours from './brandingConstants';

const base = {
  color: BrandingColours.secondaryColour,
};

export default StyleSheet.create({
  container: {
    ...base,
    backgroundColor: BrandingColours.backgroundColour,
    paddingHorizontal: 10,
    height: '100%',
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  list: {
    backgroundColor: BrandingColours.shadedColour,
    borderRadius: 8,
    marginBottom: 10,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',

    backgroundColor: BrandingColours.shadedColour,

    marginVertical: 3,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  columnCard: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',

    backgroundColor: BrandingColours.shadedColour,
    borderRadius: 8,

    marginVertical: 3,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  textBase: {
    ...base,
    display: 'flex',
  },
  headerText: {
    ...base,
    fontSize: 18,
    display: 'flex',
    color: BrandingColours.darkTextColour,
  },
  headerTextBold: {
    ...base,
    fontSize: 24,
    fontWeight: 'bold',
    color: BrandingColours.darkTextColour,
  },
  sectionHeader: {
    backgroundColor: BrandingColours.secondaryColour,
    color: BrandingColours.lightTextColour,
    fontWeight: 'bold',
    fontSize: 12,
    padding: 10,
  },
});
