/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

let AppEntry = App;

if (process.env.STORYBOOK === 'true') {
	AppEntry = require('./.storybook').default;
}

if (__DEV__) {
	import('@/reactotron.config');
}

AppRegistry.registerComponent(appName, () => AppEntry);
