// import { init } from "../../init";

// To ensure environment variables are ready for use, we call init() here
// init();

const SIMPLEFIN_APP_TOKEN: string = process.env.SIMPLEFIN_APP_TOKEN!;
const SIMPLEFIN_DEMO_TOKEN: string = process.env.SIMPLEFIN_DEMO!;
const LUNCH_MONEY_TOKEN: string = process.env.LUNCH_MONEY_TOKEN!;

const ENCRYPTION_METHOD: string = process.env.ENCRYPTION_METHOD!;
const ENCRYPTION_KEY: string = process.env.ENCRYPTION_KEY!;
const ENCRYPTION_IV: string = process.env.ENCRYPTION_IV!;

export const Environment = {
  SIMPLEFIN_APP_TOKEN,
  SIMPLEFIN_DEMO_TOKEN,
  LUNCH_MONEY_TOKEN,

  Encryption: {
    ENCRYPTION_METHOD,
    ENCRYPTION_KEY,
    ENCRYPTION_IV
  }
}