import { ActivityIndicator, Alert, Button, FlatList, SafeAreaView, SectionList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { AppAccount, AppCategory, AppDraftTransaction } from "../../models/lunchmoney/appModels";
import { commonStyles } from "../../styles/commonStyles";
import { ImportTransactionComponent } from "../../components/importing/ImportTransaction";
import { useEffect, useState } from "react";
import { brandingColours } from "../../styles/brandingConstants";
import { useParentContext } from "../../context/app/appContextProvider";
import InternalLunchMoneyClient from "../../clients/lunchMoneyClient";
import { getDraftTransactions } from "../../data/transformLunchMoney";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { getParsedTransactions } from "../../data/transformSimpleFin";
import { getAccountsData } from "../../clients/simplefinClient";
import { getSimpleFinAuth } from "../../utils/simpleFinAuth";
import { StorageKeys } from "../../models/enums/storageKeys";
import { storeData } from "../../utils/asyncStorage";
import { getGroupedDraftTransactionsByAccount } from "../../data/utils";


const styles = StyleSheet.create({
  card: {
    ...commonStyles.card,
    flex: 0,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 8,
    justifyContent: 'space-between'
  },
  button: {
    backgroundColor: brandingColours.secondaryColour,
    marginTop: 10,
    //marginBottom: 25,
    height: 40,
    borderColor: "#8ECAE6",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: brandingColours.shadedColour,
    fontWeight: "bold",
    fontSize: 18
  }
});

export default function ImportTransactionsScreen({ route, navigation }) {
  const {
    transactionsToImport,
    lmAccounts,
    lunchMoneyClient,
    lastImportDateString
  }: {
    transactionsToImport: AppDraftTransaction[],
    lmAccounts: Map<number, AppAccount>,
    lunchMoneyClient: InternalLunchMoneyClient,
    lastImportDateString: string
  } = route.params;
  const { categories } = useParentContext().appState;

  const [categoriesAvailable, setCategoriesAvailable] = useState<{"label": string, "value": AppCategory}[]>([]);
  const [isReady, setIsReady] = useState<boolean>(false);

  const [importDate, setImportDate] = useState<Date>(new Date(lastImportDateString));
  const [isFetchingTransactions, setIsFetchingTransactions] = useState<boolean>(false);
  const [importingTransactions, setImportingTransactions] = useState<AppDraftTransaction[]>(transactionsToImport);

  const [selectedTransactions] = useState<Map<string, AppDraftTransaction>>(new Map());
  const [creatingTransactions, setCreatingTransactions] = useState<boolean>(false);

  const populateAvailableCategories = () => {
    if (!isReady && categories != null) {
      setCategoriesAvailable(categories
        .filter(category => !category.isGroup)
        .map(category => {
          return {"label": category.name, "value": category}
        })
      );
    }
    setIsReady(true);
  }

  const handleDateChange = async (event: DateTimePickerEvent, date: Date) => {
    // TODO: we should get simplefinAuth from global state
    setImportDate(date);
    if (event.type === "dismissed") {
      setIsFetchingTransactions(true);
      await storeData(StorageKeys.LAST_DATE_OF_IMPORT, date.toISOString());

      const parsedTransactions = getParsedTransactions(await getAccountsData(await getSimpleFinAuth(), date));
      setImportingTransactions(parsedTransactions);
      setIsFetchingTransactions(false);
    }
  }

  const handleTransactionUpdate = (updatedTransaction: AppDraftTransaction) => {
    if (updatedTransaction.importable) {
      selectedTransactions.set(updatedTransaction.externalId, updatedTransaction);
    } else {
      selectedTransactions.delete(updatedTransaction.externalId);
    }
  }

  const handleTransactionsCreation = async () => {
    setCreatingTransactions(true);
    if (selectedTransactions.size === 0) {
      Alert.alert("No transactions to import", null, [{text: "Ok", onPress: () => navigation.getParent()?.goBack()}]);
      return;
    }

    const draftTransactions = getDraftTransactions(Array.from(selectedTransactions.values()));
    await lunchMoneyClient.createTransactions(draftTransactions);

    Alert.alert("Transactions succussfully created!",
      "Your transaction data should be available to view on Lunch Money now", [
        {text: "Ok", onPress: () => navigation.getParent()?.goBack()}
      ]);
  }

  const handleImportButtonClick = () => {
    Alert.alert(`Importing ${selectedTransactions.size} transactions`, "Do you want to continue?", [
      {text: "Cancel", style: "cancel"},
      {text: "Import", onPress: () => handleTransactionsCreation()}
    ])
  }

  const separator = () => {
    return (
      <View style={{
        borderBottomColor: brandingColours.dividerColour,
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginHorizontal: 10
      }} />
    )
  }

  useEffect(() => {
    populateAvailableCategories();
  }, [navigation, isReady]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color={brandingColours.primaryColour} />
      </View>
    )
  }

  if (isFetchingTransactions) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color={brandingColours.primaryColour} />
        <Text style={{ textAlign: "center" }}>Fetching transactions...</Text>
      </View>
    )
  }

  if (creatingTransactions) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color={brandingColours.primaryColour} />
        <Text style={{ textAlign: "center" }}>Importing transactions...</Text>
      </View>
    )
  }

  return (
  <SafeAreaView style={{ flex: 1 }}>
    <View style={[commonStyles.container]}>
      <View style={styles.card}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: brandingColours.darkTextColour }}>Importing transactions from</Text>
        </View>
        <DateTimePicker
          accentColor={brandingColours.secondaryColour}
          textColor={brandingColours.darkTextColour}
          themeVariant="light"
          style={{alignSelf: "flex-end"}}
          mode="date"
          value={importDate}
          maximumDate={new Date()}
          onChange={handleDateChange} />
      </View>
      <SectionList
        style={[commonStyles.list, { marginBottom: 15 }]}
        ItemSeparatorComponent={separator}
        sections={getGroupedDraftTransactionsByAccount(importingTransactions)}
        renderSectionHeader={({ section: { title: accountName } }) => (
          <Text style={commonStyles.sectionHeader}>{accountName}</Text>
        )}
        renderItem={({ item }) => <ImportTransactionComponent
          transaction={item}
          updateTransaction={handleTransactionUpdate}
          availableCategories={categoriesAvailable}
          lmAccount={lmAccounts?.get(item.lmAccountId)}
        />}
      />

      <TouchableOpacity
        style={styles.button}>
        {/* //</View>onPress={() => handleNextButtonClick()}> */}
        <Text style={styles.buttonText}>Import transactions</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
  );
}