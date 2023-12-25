export type SimpleFinTransaction = {
  id:	string,
  posted:	EpochTimeStamp,
  amount: string,
  payee?: string,
  description: string,
  pending?: boolean
  extra: {}
}