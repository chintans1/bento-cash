import { StyleSheet, Text, View } from 'react-native';
import { BrandingColours } from '../styles/brandingConstants';

type CategoryProps = {
  categoryName: string;
};

const categoryStyles = StyleSheet.create({
  category: {
    backgroundColor: BrandingColours.backgroundColour,
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },

  categoryText: {
    fontWeight: 'bold',
    color: BrandingColours.darkTextColour,
    fontSize: 8,
  },
});

function CategoryComponent({ categoryName }: CategoryProps) {
  if (!categoryName) {
    return null;
  }

  return (
    <View style={categoryStyles.category}>
      <Text style={categoryStyles.categoryText}>{categoryName}</Text>
    </View>
  );
}

export default CategoryComponent;
