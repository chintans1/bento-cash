import { AccountsResponse } from '../models/simplefin/accounts';
import { SimpleFinAuthentication } from '../models/simplefin/authentication';
import { storeAuthenticationDetails } from '../utils/auth';
import base64 from 'react-native-base64';

export function getClaimUrl(setupToken: string): string {
  return base64.decode(setupToken);
}

export async function storeSimpleFinAuth(claimUrl: string): Promise<SimpleFinAuthentication> {
  const response = await fetch(claimUrl, {
    method: "POST",
    headers: {
      "Content-Length": "0"
    }
  });

  if (response.status != 200) {
    throw new Error(`Could not fetch access URL,
      got status ${response.status} with body ${await response.text()}\n
      Ensure your credentials are not compromised!`);
  }

  return await response.text().then(fullAccessUrl => {
    const [scheme, schemelessUrl] = fullAccessUrl.split("//");
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

export async function getAccountsData(simpleFinAuth: SimpleFinAuthentication): Promise<AccountsResponse> {
  // TODO: natively handle query params
  const response = await fetch(`${simpleFinAuth.baseUrl}/accounts?start-date=1702191600`, {
    headers: {
      Authorization: `Basic ${btoa(`${simpleFinAuth.username}:${simpleFinAuth.password}`)}`
    }
  });

  if (response.status != 200) {
    throw new Error(`Could not fetch accounts data, got status ${response.status} with body ${await response.text()}`);
  }
  return response.json();
}