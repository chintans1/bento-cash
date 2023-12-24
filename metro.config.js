// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);


const simplefinLmIntegration = "/Users/chintan/Documents/Development/fidelity-lunchmoney";
config.resolver.nodeModulesPaths.push(simplefinLmIntegration);
config.watchFolders.push(simplefinLmIntegration);

module.exports = config;