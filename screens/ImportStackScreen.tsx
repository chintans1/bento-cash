import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ImportMethodSelectionScreen from './importing/ImportMethodSelection';
import SimpleFinConnectionScreen from './importing/SimpleFinConnection';
import AccountSelectionScreen from './importing/AccountSelection';
import { AccountCustomizationScreen } from './importing/AccountCustomization';
import ImportSyncConfirmationScreen from './importing/ImportSyncConfirmation';
import AccountUpdatesScreen from './importing/AccountUpdates';
import {
  AppAccount,
  AppDraftAccount,
  AppDraftTransaction,
} from '../models/lunchmoney/appModels';
import TransactionSelectionScreen from './importing/TransactionSelection';
import TransactionCreationScreen from './importing/TransactionCreation';
import CompletionScreen from './importing/Completion';

export type ImportStackParamList = {
  ImportMethodSelection: undefined;
  SimpleFinConnection: undefined;
  AccountSelection: {
    accountsToImport: AppDraftAccount[];
    syncedAccounts: AppAccount[];
    transactionsToImport: AppDraftTransaction[];
  };
  ImportSyncConfirmation: {
    selectedNewAccounts: AppDraftAccount[];
    selectedExistingAccounts: AppAccount[];
    transactionsToImport: AppDraftTransaction[];
  };
  AccountCustomization: { selectedNewAccounts: AppDraftAccount[] };
  AccountUpdates: {
    selectedNewAccounts: AppDraftAccount[];
    selectedExistingAccounts: AppAccount[];
    transactionsToImport: AppDraftTransaction[];
  };
  TransactionSelection: { transactionsToImport: AppDraftTransaction[] };
  TransactionCreation: { selectedTransactions: AppDraftTransaction[] };
  Completion: undefined;
};

const ImportStack = createNativeStackNavigator<ImportStackParamList>();

// Main component for the import/sync flow
export default function ImportStackScreen() {
  return (
    <ImportStack.Navigator screenOptions={{ headerShown: false }}>
      <ImportStack.Screen
        name="ImportMethodSelection"
        component={ImportMethodSelectionScreen} // Done
      />
      <ImportStack.Screen
        name="SimpleFinConnection"
        component={SimpleFinConnectionScreen} // Done
      />
      <ImportStack.Screen
        name="AccountSelection"
        component={AccountSelectionScreen}
      />
      <ImportStack.Screen
        name="ImportSyncConfirmation"
        component={ImportSyncConfirmationScreen}
      />
      <ImportStack.Screen
        name="AccountCustomization"
        component={AccountCustomizationScreen}
      />
      <ImportStack.Screen
        name="AccountUpdates"
        component={AccountUpdatesScreen}
      />
      <ImportStack.Screen
        name="TransactionSelection"
        component={TransactionSelectionScreen}
      />
      <ImportStack.Screen
        name="TransactionCreation"
        component={TransactionCreationScreen}
      />
      <ImportStack.Screen name="Completion" component={CompletionScreen} />
    </ImportStack.Navigator>
  );
}
