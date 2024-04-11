import { AppLunchMoneyInfo } from "../models/lunchmoney/appModels";

const isTokenValid = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch('https://dev.lunchmoney.app/v1/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': '*/*'
      },
    });

    if (response.status != 200) {
      console.log("Token was not valid, returning false");
      return false;
    }
    console.log("Token was good and valid");
    return true;
  } catch (error) {
    console.error('An error occurred:', error);
    return false;
  }
}

const getTokenInfo = async (token: string): Promise<AppLunchMoneyInfo> => {
  try {
    const response = await fetch('https://dev.lunchmoney.app/v1/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': '*/*'
      },
    });
    const responseJson = await response.json();

    return {
      userId:	responseJson.user_id,
      userName: responseJson.user_name,
      userEmail: responseJson.user_email,
      budgetName: responseJson.budget_name,
      apiKeyLabel: responseJson.api_key_label || "unknown"
    }
  } catch (error) {
    console.error('An error occurred:', error);
    return null;
  }
}

export const accessClient = {
  isTokenValid,
  getTokenInfo
}