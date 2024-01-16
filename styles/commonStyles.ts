import { StyleSheet, View } from "react-native";
import { brandingColours } from "./brandingConstants";

const base = {
  color: brandingColours.secondaryColour
}

export const commonStyles = StyleSheet.create({
  container: {
    ...base,
    backgroundColor: brandingColours.backgroundColour,
    paddingHorizontal: 10,
    height: '100%'
  },
  rowView: {
    flexDirection: "row",
    alignItems: "center",
  },
  list: {
    backgroundColor: brandingColours.shadedColour,
    borderRadius: 8,
    marginBottom: 10,
  },
  card: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",

    backgroundColor: brandingColours.shadedColour,

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
    borderRadius: 8,

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
    display: "flex",
    color: brandingColours.primaryColour
  },
  headerTextBold: {
    ...base,
    fontSize: 24,
    fontWeight: 'bold',
    color: brandingColours.primaryColour
  }
});