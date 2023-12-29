import { SimpleFinAuthentication } from "../models/simplefin/authentication";
import { StorageKeys } from "../models/enums/storageKeys";
import { doesKeyExist, getValueFor, save } from "./secureStore";

export async function isAuthPresent() {
  return await doesKeyExist(StorageKeys.BASE_URL_KEY)
    && await doesKeyExist(StorageKeys.USERNAME_KEY)
    && await doesKeyExist(StorageKeys.PASSWORD_KEY);
}

export async function getSimpleFinAuth(): Promise<SimpleFinAuthentication> {
  let simpleFinAuth: SimpleFinAuthentication;

  if (await isAuthPresent()) {
    simpleFinAuth = {
      baseUrl: await getValueFor(StorageKeys.BASE_URL_KEY),
      username: await getValueFor(StorageKeys.USERNAME_KEY),
      password: await getValueFor(StorageKeys.PASSWORD_KEY)
    }
  }

  return simpleFinAuth;
}

export async function storeAuthenticationDetails(authDetails: SimpleFinAuthentication) {
  await save(StorageKeys.BASE_URL_KEY, authDetails.baseUrl);
  await save(StorageKeys.USERNAME_KEY, authDetails.username);
  await save(StorageKeys.PASSWORD_KEY, authDetails.password);
}
