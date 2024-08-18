const path = require("path");
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');


const { generate } = require("@storybook/react-native/scripts/generate");

generate({
  configPath: path.resolve(__dirname, "./.storybook"),
  useJs: true,
});

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'cjs', 'mjs', 'json'],
  }
};

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.transformer.unstable_allowRequireContext = true;

module.exports = mergeConfig(defaultConfig, config);
