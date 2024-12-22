import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Sentry from '@sentry/react-native';
import Icon from 'react-native-vector-icons/Feather';
import commonStyles from '../../styles/commonStyles';
import { NewBrandingColours } from '../../styles/brandingConstants';

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    backgroundColor: NewBrandingColours.neutral.lightGray,
    borderRadius: 50,
    padding: 16,
    marginBottom: 24,
  },
  title: {
    ...commonStyles.headerText,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    color: NewBrandingColours.text.primary,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: NewBrandingColours.text.secondary,
  },
  errorDetailsContainer: {
    marginBottom: 24,
    backgroundColor: NewBrandingColours.neutral.lightGray,
    padding: 16,
    borderRadius: 12,
    width: '100%',
  },
  errorDetailsText: {
    fontSize: 14,
    textAlign: 'center',
    color: NewBrandingColours.text.muted,
  },
  button: {
    backgroundColor: NewBrandingColours.primary.main,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: NewBrandingColours.neutral.white,
    marginLeft: 8,
  },
});

function ErrorFallback({ error, resetError }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon
          name="alert-triangle"
          size={48}
          color={NewBrandingColours.accent.red}
        />
      </View>
      <Text style={styles.title}>Oops! Something went wrong</Text>
      <Text style={styles.message}>
        Sorry for the inconvenience. The app encountered an unexpected error.
      </Text>
      <View style={styles.errorDetailsContainer}>
        <Text style={styles.errorDetailsText}>{error.toString()}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={resetError}>
        <Icon
          name="refresh-cw"
          size={20}
          color={NewBrandingColours.neutral.white}
        />
        <Text style={styles.buttonText}>Restart App</Text>
      </TouchableOpacity>
    </View>
  );
}

function ErrorBoundary({ children }) {
  return (
    <Sentry.ErrorBoundary fallback={ErrorFallback}>
      {children}
    </Sentry.ErrorBoundary>
  );
}

export default ErrorBoundary;
