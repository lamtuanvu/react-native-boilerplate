/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = function(api){
	api.cache(true);
	return {
	  presets: ['babel-preset-expo'],
	  plugins: [
		  [
			  'module-resolver',
			  {
				  root: ['./src'],
				  extensions: ['.js', '.json'],
				  alias: {
					  '@': './src',
				  },
			  },
		  ],
		  'inline-dotenv',
		  'react-native-reanimated/plugin', // needs to be last
	  ],
	}
  };
  