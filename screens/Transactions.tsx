import { createTransactions } from '../clients/lunchMoneyClient';

async function getLunchMoneyTransactions() {
  const transactionsToCreate = [];
  transactionsToCreate.push({
    date: "2023-12-18",
    amount: "450.00",
    payee: "LM App",
    currency: "usd",
    // asset_id: 1, This is not required but ideally we should try to find a way, TODO
    notes: "Description",
    status: "cleared",
  });

  const transactions = createTransactions(transactionsToCreate);

  console.log(await transactions);

  return transactions;
}