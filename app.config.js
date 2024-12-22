export default ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    SENTRY_DSN: process.env.SENTRY_DSN, // Ensure `.env.local` or `.env` is correctly set up
  },
  plugins: ["expo-secure-store"],
});
