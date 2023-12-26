import { StyleSheet, Text, View } from "react-native"
import { brandingColours } from "../styles/brandingConstants";
import { AppCategory } from "../models/lunchmoney/appModels";

type CategoryProps = {
  categoryName: string,
  category?: AppCategory
}

const categoryStyles = StyleSheet.create({
  category: {
    backgroundColor: brandingColours.backgroundColour,
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 10
   },

   categoryText: {
    fontWeight: "bold",
    color: brandingColours.secondaryColour,
    fontSize: 8,
   }
});

export function CategoryComponent({ categoryName, category }: CategoryProps) {
  if (!categoryName) {
    return null;
  }

  return (
    <View style={categoryStyles.category}>
      <Text style={categoryStyles.categoryText}>{categoryName}</Text>
    </View>
  )
}