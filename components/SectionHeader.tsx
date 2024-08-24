import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import commonStyles from '../styles/commonStyles';
import BrandingColours from '../styles/brandingConstants';

type SectionHeaderProps = {
  title: string;
};

function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    borderBottomWidth: 2,
    borderColor: BrandingColours.secondaryColour,
    backgroundColor: BrandingColours.secondaryColour
  },
  headerText: {
    ...commonStyles.sectionHeader,
    color: BrandingColours.lightTextColour
  },
});

export default SectionHeader;
