import { AppLunchMoneyInfo } from '../models/lunchmoney/appModels';
import {
  ErrorType,
  handleError,
  handleGenericMessage,
} from '../utils/errorHandler';

const isTokenValid = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch('https://dev.lunchmoney.app/v1/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: '*/*',
      },
    });

    if (response.status !== 200) {
      handleGenericMessage(
        'Token was invalid',
        'Please enter a valid Lunch Money token.',
      );
      return false;
    }

    console.log('Token was good and valid');
    return true;
  } catch (error) {
    handleError({
      errorType: ErrorType.LUNCH_MONEY_API_ERROR,
      message: error,
    });
    return false;
  }
};

const getTokenInfo = async (token: string): Promise<AppLunchMoneyInfo> => {
  try {
    const response = await fetch('https://dev.lunchmoney.app/v1/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: '*/*',
      },
    });
    const responseJson = await response.json();

    return {
      userId: responseJson.user_id,
      userName: responseJson.user_name,
      userEmail: responseJson.user_email,
      budgetName: responseJson.budget_name,
      primaryCurrency: responseJson.primary_currency,
      apiKeyLabel: responseJson.api_key_label || 'unknown',
    };
  } catch (error) {
    handleError({
      errorType: ErrorType.LUNCH_MONEY_API_ERROR,
      message: error,
    });
    return null;
  }
};

export default { isTokenValid, getTokenInfo };
