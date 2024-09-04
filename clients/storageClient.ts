import { StorageKeys } from "../models/enums/storageKeys";
import { getData } from "../utils/asyncStorage";

export const getLastImportDate = async (): Promise<Date> => {
  const lastImportDate = await getData(StorageKeys.LAST_DATE_OF_IMPORT);
  console.log(lastImportDate);
  return lastImportDate !== null ? new Date(lastImportDate) : new Date();
};