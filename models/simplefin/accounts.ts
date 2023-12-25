import { SimpleFinAccount } from "./account"

export type AccountsResponse = {
  errors: string[],
  accounts: SimpleFinAccount[]
}