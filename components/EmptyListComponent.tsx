import { StyleSheet, Text, View } from 'react-native';
import { NewBrandingColours } from '../styles/brandingConstants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noStateText: {
    color: NewBrandingColours.text.muted,
    // fontWeight: 'bold',
    fontSize: 18,
  },
});

const renderNoStateMessage = (emptyMessage: string) => {
  return (
    <View style={styles.container}>
      <Text style={styles.noStateText}>{emptyMessage}</Text>
    </View>
  );
};

export default renderNoStateMessage;
