import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { commonStyles } from "../styles/commonStyles";
import { AccountsResponse } from "../models/simplefin/accounts";
import { getAccountsData } from "../clients/simplefinClient";
import { getSimpleFinAuth } from "../utils/simpleFinAuth";
import { SimpleFinImportData, getImportData } from "../data/transformSimpleFin";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { StorageKeys } from "../models/enums/storageKeys";


export default function SimpleFinImport() {
  const [importData, setImportData] = useState<SimpleFinImportData>(null);

  const [accountMappings, setAccountMappings] = useState<Map<string, string>>(new Map<string, string>());
  const { getItem: getAccountMappings } = useAsyncStorage(StorageKeys.ACCOUNT_MAPPING_KEY);

  const [isReady, setIsReady] = useState<boolean>(false);

  const fetchDataFromSimpleFin = async () => {
    const fetchedAccountsResponse = await getAccountsData(await getSimpleFinAuth());
    const fetchedAccountMappings = await getAccountMappings() || null;


    setAccountMappings(new Map(JSON.parse(fetchedAccountMappings)));
    setImportData(getImportData(accountMappings, fetchedAccountsResponse));

    setIsReady(true);
  }


  useEffect(() => {
    fetchDataFromSimpleFin();
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <View style={commonStyles.container}>
      <Text>Accounts to import: {importData.accountsToImport.length}</Text>
      <FlatList
        data={importData.accountsToImport}
        renderItem={({item}) => {
          return (<Text>{item.accountName} from {item.institutionName} with balance {item.balance}</Text>);
        }}
      />

      <Text>Transactions to import</Text>
      <FlatList
        data={importData.transactionsToImport}
        renderItem={({item}) => {
          return (<Text>{item.payee} from {item.date} with amount {item.amount}</Text>);
        }}
      />
    </View>
  )
}