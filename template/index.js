import { AppRegistry } from 'react-native';

import { name as appName } from './app.json';
import App from './src/App';

let AppEntry = App;

if (process.env.STORYBOOK === 'true') {
	AppEntry = require('./.storybook').default;
}

if (__DEV__) {
  import('@/reactotron.config');
}

AppRegistry.registerComponent(appName, () => AppEntry);
