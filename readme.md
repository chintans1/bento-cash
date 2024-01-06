# React Native Application for Lunch Money

### Existing Screens
[Transactions, Accounts, Charts, Settings] (Hidden: Initialization)
                                    ^-> [Settings, SimpleFin Import]
                                                        ^-> [Import Accounts -> Import Transactions -> Finished]

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
- [x] allow pulling data from SimpleFin
  - [x] store this pulled data locally
  - [x] allow this stored data to be mapped manually to LM
  - [x] push the mapped data to LM
- [ ] build out the transaction component more
- [x] show accounts view, all balances at once
- [x] calculate net worth at the time with balance sum
- [ ] improve styling
- [ ] store last date of import transactions
- [ ] beta on testflight
- [ ] need to sync simplefin accounts with lunch money
- [ ] need to show a way of letting customer choose existing account for importing simplefin account

we have a provider, allows update of app state itself
when updating app state, we need to take in a new API token