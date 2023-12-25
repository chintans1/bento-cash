import { StyleSheet } from "react-native";
import { brandingColours } from "./brandingConstants";


const base = {
  color: brandingColours.secondaryColour
}

export const commonStyles = StyleSheet.create({
  container: {
    ...base,
    flex: 1,
    backgroundColor: brandingColours.backgroundColour,
    // paddingTop: 22
  },
  textBase: {
    ...base,
    display: "flex"
  },
  headerText: {
    ...base,
    fontSize: 18,
    height: 44,
    display: "flex",
    color: brandingColours.primaryColour
  },
  headerTextBold: {
    ...base,
    fontSize: 24,
    height: 44,
    fontWeight: 'bold',
    color: brandingColours.primaryColour
  }
});