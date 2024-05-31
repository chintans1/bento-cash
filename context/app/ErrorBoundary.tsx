import React, { Component } from 'react';
import { Text, View } from 'react-native';
import commonStyles from '../../styles/commonStyles';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service like Sentry
    console.log(`eventually we will log this: ${error} - ${errorInfo}`);
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      // Render a fallback UI
      // return Toast.show({
      //   type: 'error',
      //   text1: 'An error occurred',
      //   text2: 'Please try reloading the app.',
      // });
      return (
        <View
          style={[
            commonStyles.container,
            { alignItems: 'center', justifyContent: 'center' },
          ]}
        >
          <Text style={commonStyles.headerText}>
            The app was about to crash, please restart!
          </Text>
        </View>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
