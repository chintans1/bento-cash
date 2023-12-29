import { SimpleFinAuthentication } from "../models/simplefin/authentication";
import { LocalStorageKeys } from "../models/enums/localStorageKeys";
import { doesKeyExist, getValueFor, save } from "./secureStore";

// export function isAuthPresent(): boolean {
//   return localStorage.getItem(LocalStorageKeys.BASE_URL_KEY) !== null
//     && localStorage.getItem(LocalStorageKeys.USERNAME_KEY) !== null
//     && localStorage.getItem(LocalStorageKeys.PASSWORD_KEY) !== null;
// }
export async function isAuthPresent() {
  return await doesKeyExist(LocalStorageKeys.BASE_URL_KEY)
    && await doesKeyExist(LocalStorageKeys.USERNAME_KEY)
    && await doesKeyExist(LocalStorageKeys.PASSWORD_KEY);
}

// export function getAuthentication(): SimpleFinAuthentication {
//   const encrypter = new Encrypter(
//     Environment.Encryption.ENCRYPTION_METHOD,
//     Environment.Encryption.ENCRYPTION_KEY,
//     Environment.Encryption.ENCRYPTION_IV
//   );

//   return {
//     baseUrl: encrypter.dencrypt(localStorage.getItem(LocalStorageKeys.BASE_URL_KEY)!),
//     username: encrypter.dencrypt(localStorage.getItem(LocalStorageKeys.USERNAME_KEY)!),
//     password: encrypter.dencrypt(localStorage.getItem(LocalStorageKeys.PASSWORD_KEY)!)
//   }
// }

export async function getSimpleFinAuth(): Promise<SimpleFinAuthentication> {
  let simpleFinAuth: SimpleFinAuthentication;

  if (await isAuthPresent()) {
    simpleFinAuth = {
      baseUrl: await getValueFor(LocalStorageKeys.BASE_URL_KEY),
      username: await getValueFor(LocalStorageKeys.USERNAME_KEY),
      password: await getValueFor(LocalStorageKeys.PASSWORD_KEY)
    }
  }

  return simpleFinAuth;
}

// export function storeAuthenticationDetails(authDetails: SimpleFinAuthentication) {
//   const encrypter = new Encrypter(
//     Environment.Encryption.ENCRYPTION_METHOD,
//     Environment.Encryption.ENCRYPTION_KEY,
//     Environment.Encryption.ENCRYPTION_IV
//   );

//   localStorage.setItem(LocalStorageKeys.BASE_URL_KEY, encrypter.encrypt(authDetails.baseUrl));
//   localStorage.setItem(LocalStorageKeys.USERNAME_KEY, encrypter.encrypt(authDetails.username));
//   localStorage.setItem(LocalStorageKeys.PASSWORD_KEY, encrypter.encrypt(authDetails.password));
// }

export async function storeAuthenticationDetails(authDetails: SimpleFinAuthentication) {
  await save(LocalStorageKeys.BASE_URL_KEY, authDetails.baseUrl);
  await save(LocalStorageKeys.USERNAME_KEY, authDetails.username);
  await save(LocalStorageKeys.PASSWORD_KEY, authDetails.password);
}
