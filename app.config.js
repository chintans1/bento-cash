export default {
  expo: {
    extra: {
      SENTRY_DSN: process.env.SENTRY_DSN,  // Make sure your `.env.local` is correctly set
    },
  },
};