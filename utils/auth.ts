import { SimpleFinAuthentication } from "../models/simplefin/authentication";
// import { LocalStorage } from "node-localstorage";
import { LocalStorageKeys } from "../models/enums/localStorageKeys";
import { Encrypter } from "./encrypt";
import { Environment } from "../models/enums/environment";

// const localStorage = new LocalStorage('./lm-simplefin')

export function isAuthPresent(): boolean {
  return localStorage.getItem(LocalStorageKeys.BASE_URL_KEY) !== null
    && localStorage.getItem(LocalStorageKeys.USERNAME_KEY) !== null
    && localStorage.getItem(LocalStorageKeys.PASSWORD_KEY) !== null;
}

export function getAuthentication(): SimpleFinAuthentication {
  const encrypter = new Encrypter(
    Environment.Encryption.ENCRYPTION_METHOD,
    Environment.Encryption.ENCRYPTION_KEY,
    Environment.Encryption.ENCRYPTION_IV
  );

  return {
    baseUrl: encrypter.dencrypt(localStorage.getItem(LocalStorageKeys.BASE_URL_KEY)!),
    username: encrypter.dencrypt(localStorage.getItem(LocalStorageKeys.USERNAME_KEY)!),
    password: encrypter.dencrypt(localStorage.getItem(LocalStorageKeys.PASSWORD_KEY)!)
  }
}

export function storeAuthenticationDetails(authDetails: SimpleFinAuthentication) {
  const encrypter = new Encrypter(
    Environment.Encryption.ENCRYPTION_METHOD,
    Environment.Encryption.ENCRYPTION_KEY,
    Environment.Encryption.ENCRYPTION_IV
  );

  localStorage.setItem(LocalStorageKeys.BASE_URL_KEY, encrypter.encrypt(authDetails.baseUrl));
  localStorage.setItem(LocalStorageKeys.USERNAME_KEY, encrypter.encrypt(authDetails.username));
  localStorage.setItem(LocalStorageKeys.PASSWORD_KEY, encrypter.encrypt(authDetails.password));
}