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


### TODO for MVP
- [ ] bugs
  - [x] blank screen after you enter API key on initialization
  - [x] unknown account showing up in transactions
  - [x] accounts page is not showing negative balance for credit accounts
  - [x] account page should show the right name, i think its display name or mix of 2
  - [x] blur out `Fetch data via SimpleFIN` if there is no Simplefin token set
  - [x] formatting of import transaction date is bad on a iphone 12
  - [ ] weird issue where accounts wasn't populated for "choose from existing accounts"? (maybe its plaid related)
  - [x] account name field resets when you backspace all the way
  - [ ] if you press "cancel", it still presents itself as doing something
  - [ ] handle loan as a negative account

### TODO (not prioritized)
  - [ ] horrible UX on import account; you essentially need to type name and institution first otherwise checkbox won't clear
    - [ ] also you can't select a account if you already chose a type
    - [ ] Ideal UX: you can update the account name and institution to whatever you feel
          Whenever there is a valid state present, we will enable the checkbox.
          If an existing account is chosen even with account type, we will rely on existing account.
  - [ ] account data should probably be updated after importing accounts was done, not rely on total app refresh
  - [ ] handle multiple currencies

- [ ] clean up the code
  - [ ] log statements
  - [ ] we should not fetch twice in import flow
  - [ ] remove any TODOs or document them here
- [ ] improve styling code, ensure its living in common styles
  - [ ] import transaction styling is weird
- [ ] need to add a refresh mechanism

### TODO for future
- [ ] no more popup alerts, use modals to dictate flow
  - likely do not need multiple alerts for import flow
- [ ] automatic linting

### TODO
- [x] store last date of import transactions
- [x] publish new build

- [ ] update state after import of data
- [ ] improve styling

- [ ] store simple fin auth details in context
  - [ ] move towards maybe only storing LM API key and simple FIN auth in context
- [ ] build out the transaction component more

- [x] add new tab for SimpleFin base
- [x] allow pulling data from SimpleFin
  - [x] store this pulled data locally
  - [x] allow this stored data to be mapped manually to LM
  - [x] push the mapped data to LM
- [x] show accounts view, all balances at once
- [x] calculate net worth at the time with balance sum
- [x] beta on testflight
- [x] need to sync simplefin accounts with lunch money
- [x] need to show a way of letting customer choose existing account for importing simplefin account

we have a provider, allows update of app state itself
when updating app state, we need to take in a new API token