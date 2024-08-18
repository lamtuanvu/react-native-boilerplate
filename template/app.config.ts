import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: config.slug ?? 'my-app',
  name: config.name ?? 'My App',
  extra: {
    isStorybook: process.env.STORYBOOK === 'true',
  },
});
