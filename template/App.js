import MyApp from './src/App';

if (__DEV__) {
	import('@/reactotron.config');
}

export default function App() {
	// eslint-disable-next-line react/jsx-filename-extension
	return <MyApp />;
}
