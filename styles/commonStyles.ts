import { StyleSheet } from "react-native";

const base = {
  padding: 5
}

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 22
  },
  textBase: {
    ...base,
    display: "flex"
  },
  headerText: {
    ...base,
    fontSize: 18,
    height: 44,
    display: "flex"
  },
  headerTextBold: {
    ...base,
    fontSize: 24,
    height: 44,
    fontWeight: 'bold'
  }
});