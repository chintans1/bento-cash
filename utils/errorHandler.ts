import Toast from 'react-native-toast-message';

export enum ErrorType {
  NETWORK_ERROR,
  LUNCH_MONEY_API_ERROR,
  SIMPLEFIN_API_ERROR,
}

const ErrorTypeTitles: Record<ErrorType, { title: string }> = {
  [ErrorType.NETWORK_ERROR]: { title: 'Network error' },
  [ErrorType.LUNCH_MONEY_API_ERROR]: {
    title: 'Ran into error with LunchMoney API',
  },
  [ErrorType.SIMPLEFIN_API_ERROR]: {
    title: 'Ran into error with SimpleFIN API',
  },
};

export type Error = {
  errorType: ErrorType;
  message: string;
};

const createErrorToast = (errorTitle: string, errorMessage: string) => {
  console.error(`${errorTitle}:  ${errorMessage}`);
  Toast.show({
    type: 'error',
    text1: errorTitle,
    text2: errorMessage,
  });
};

export const handleGenericMessage = (title: string, message: string) => {
  console.log(`${title}: ${message}`);
  Toast.show({
    type: 'info',
    text1: title,
    text2: message,
  });
};

export const handleError = (error: Error) => {
  createErrorToast(ErrorTypeTitles[error.errorType].title, error.message);
};

export const handleGenericError = (error: string) => {
  createErrorToast('An error occurred', error);
};
