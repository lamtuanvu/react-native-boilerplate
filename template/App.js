import MyApp from './src/App';
import Constants from 'expo-constants';

if (__DEV__) {
	import('@/reactotron.config');
}

let AppEntry = MyApp;
if (Constants.expoConfig.extra?.isStorybook) {
	AppEntry = require('./.storybook').default;
}

export default function App() {
	// eslint-disable-next-line react/jsx-filename-extension
	return <AppEntry />;
}
