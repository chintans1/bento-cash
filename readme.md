# React Native Application for Lunch Money

How to handle SimpleFIN sync:
  - premise of the sync is to get transaction data into Lunch Money
  - can show "found x new transactions to import, x new accounts"
    - before proceeding to import accounts, they must import accounts
      - we store account ID from SF to LM account ID mapping
  - show all transactions, try to map account as best as you can
    - for account unmapped, let user decide (must create or choose)
    - we can't choose category so user will decide given existing categories
  - once ready, we validate and create transactions and all





### TODO
- [ ] store simple fin auth details in context
  - [ ] move towards maybe only storing LM API key and simple FIN auth in context
- [x] add new tab for SimpleFin base
- [ ] allow pulling data from SimpleFin
  - [ ] store this pulled data locally
  - [ ] allow this stored data to be mapped manually to LM
  - [ ] push the mapped data to LM
- [ ] build out the transaction component more
- [x] show accounts view, all balances at once
- [x] calculate net worth at the time with balance sum
- [ ] improve styling

we have a provider, allows update of app state itself
when updating app state, we need to take in a new API token