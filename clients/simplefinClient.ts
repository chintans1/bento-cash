import base64 from 'react-native-base64';
import { AccountsResponse } from '../models/simplefin/accounts';
import { SimpleFinAuthentication } from '../models/simplefin/authentication';
import getDateForSimpleFin from '../utils/dateUtils';
import { storeAuthenticationDetails } from '../utils/simpleFinAuth';
import { ErrorType, handleError } from '../utils/errorHandler';

export function getClaimUrl(setupToken: string): string {
  return base64.decode(setupToken);
}

export async function storeSimpleFinAuth(
  claimUrl: string,
): Promise<SimpleFinAuthentication> {
  const response = await fetch(claimUrl, {
    method: 'POST',
    headers: {
      'Content-Length': '0',
    },
  });

  if (response.status !== 200) {
    handleError({
      errorType: ErrorType.SIMPLEFIN_API_ERROR,
      message: `Ensure your SimpleFIN token is unused. Could not get access URL, got status ${response.status} with body ${await response.text()}.`,
    });
  }

  return response.text().then(fullAccessUrl => {
    const [scheme, schemelessUrl] = fullAccessUrl.split('//');
    const [auth, url] = schemelessUrl.split('@');

    const authDetails = {
      baseUrl: `${scheme}//${url}`,
      username: auth.split(':')[0],
      password: auth.split(':')[1],
    };
    storeAuthenticationDetails(authDetails);
    return authDetails;
  });
}

export async function getAccountsData(
  simpleFinAuth: SimpleFinAuthentication,
  startDate: Date,
): Promise<AccountsResponse> {
  const start = performance.now();
  const response = await fetch(
    `${simpleFinAuth.baseUrl}/accounts?start-date=${getDateForSimpleFin(startDate)}`,
    {
      headers: {
        Authorization: `Basic ${base64.encode(`${simpleFinAuth.username}:${simpleFinAuth.password}`)}`,
      },
    },
  );
  const mid = performance.now();
  console.log(`${mid - start} ms from start to mid`);

  if (response.status !== 200) {
    handleError({
      errorType: ErrorType.SIMPLEFIN_API_ERROR,
      message: `Could not fetch accounts data, got status ${response.status} with body ${await response.text()}`,
    });
  }

  const responseJson: AccountsResponse = await response.json();
  const end = performance.now();
  console.log(`${end - start} ms from start to end`);

  if (responseJson.errors.length > 0) {
    handleError({
      errorType: ErrorType.SIMPLEFIN_API_ERROR,
      message: `Error during account data fetch, ${responseJson.errors}`,
    });
  }
  return responseJson;
}
