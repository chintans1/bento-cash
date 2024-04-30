import { SimpleFinAuthentication } from '../models/simplefin/authentication';
import { SecureStorageKeys } from '../models/enums/storageKeys';
import { doesKeyExist, getValueFor, save } from './secureStore';

export async function isAuthPresent() {
  return (
    doesKeyExist(SecureStorageKeys.BASE_URL_KEY) &&
    doesKeyExist(SecureStorageKeys.USERNAME_KEY) &&
    doesKeyExist(SecureStorageKeys.PASSWORD_KEY)
  );
}

export async function getSimpleFinAuth(): Promise<SimpleFinAuthentication> {
  let simpleFinAuth: SimpleFinAuthentication;

  if (await isAuthPresent()) {
    simpleFinAuth = {
      baseUrl: await getValueFor(SecureStorageKeys.BASE_URL_KEY),
      username: await getValueFor(SecureStorageKeys.USERNAME_KEY),
      password: await getValueFor(SecureStorageKeys.PASSWORD_KEY),
    };
  }

  return simpleFinAuth;
}

export async function storeAuthenticationDetails(
  authDetails: SimpleFinAuthentication,
) {
  await save(SecureStorageKeys.BASE_URL_KEY, authDetails.baseUrl);
  await save(SecureStorageKeys.USERNAME_KEY, authDetails.username);
  await save(SecureStorageKeys.PASSWORD_KEY, authDetails.password);
}
