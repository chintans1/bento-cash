import { StorageKeys } from '../models/enums/storageKeys';
import { getData, storeData } from '../utils/asyncStorage';

export const getAccountMappings = async (): Promise<Map<string, string>> => {
  const existingAccountMappings = await getData(
    StorageKeys.ACCOUNT_MAPPING_KEY,
  );
  return existingAccountMappings != null &&
    JSON.stringify(existingAccountMappings) !== '{}'
    ? new Map(existingAccountMappings)
    : new Map<string, string>();
};

export const storeAccountMappings = async (
  accountMappingsToStore: Map<string, string>,
) => {
  await storeData(
    StorageKeys.ACCOUNT_MAPPING_KEY,
    Array.from(accountMappingsToStore.entries()),
  );
};
