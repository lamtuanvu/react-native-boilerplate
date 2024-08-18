const path = require("path");
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

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
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
    unstable_allowRequireContext: true,
  },
  resolver: {
    sourceExts: [...sourceExts, 'svg'],
    assetExts: assetExts.filter((ext) => ext !== 'svg'),
  },
};

defaultConfig.transformer.unstable_allowRequireContext = true;

module.exports = mergeConfig(defaultConfig, config);
