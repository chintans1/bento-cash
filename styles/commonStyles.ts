import { StyleSheet } from "react-native";
import { brandingColours } from "./brandingConstants";


const base = {
  color: brandingColours.secondaryColour
}

export const commonStyles = StyleSheet.create({
  container: {
    ...base,
    paddingTop: 3,
    flex: 1,
    backgroundColor: brandingColours.backgroundColour,
    // paddingTop: 22
    paddingHorizontal: 10
  },
  card: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",

    backgroundColor: brandingColours.shadedColour,
    borderRadius: 5,

    // marginHorizontal: 5,
    marginVertical: 3,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  columnCard: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",

    backgroundColor: brandingColours.shadedColour,
    borderRadius: 5,

    // marginHorizontal: 5,
    marginVertical: 3,
    paddingVertical: 10,
    paddingHorizontal: 15,
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