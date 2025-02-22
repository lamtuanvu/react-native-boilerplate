// eslint-disable-next-line @typescript-eslint/no-var-requires
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf'); // Add this to package.json if not already included

function isYarnAvailable() {
	try {
		return !!(
			execSync('yarn --version', {
				stdio: [0, 'pipe', 'ignore'],
			}).toString() || ''
		).trim();
	} catch (error) {
		return null;
	}
}
function isNpmAvailable() {
	try {
		return !!(
			execSync('npm --version', {
				stdio: [0, 'pipe', 'ignore'],
			}).toString() || ''
		).trim();
	} catch (error) {
		return null;
	}
}

module.exports = {
	async apply(value, previousValues) {
		return new Promise(resolve => {
			let packageManager = null;

			// react-native cli prefer yarn so we follow the same logic
			if (isYarnAvailable()) {
				packageManager = 'yarn';
			} else if (isNpmAvailable()) {
				packageManager = 'npm';
			}

			if (!packageManager) {
				console.error(
					'🚨 No package manager found. Please install yarn or npm.',
				);
				process.exit(1);
			}

			if (value) {
				console.log('\n');

				console.log('📦 Update package.json for expo up expo...');

				// Read original package.json
				const originalPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));

				// Define expo package data inline
				const expoPackage = {
					main: "expo/AppEntry.js",
					scripts: {
						start: "expo start",
						android: "expo run:android",
						ios: "expo run:ios"
					},
					dependencies: {
						"expo": "^52.0.37",
						"expo-dev-client": "~5.0.12",
						"expo-status-bar": "~2.0.1"
					},
					devDependencies: {
						"@react-native-async-storage/async-storage": "1.23.1",
						"@react-native-community/datetimepicker": "^8.2.0",
						"@react-native-community/slider": "4.5.5"
					}
				};

				// Merge packages
				const mergedPackage = {
					...originalPackage,
					main: expoPackage.main,
					scripts: {
						...originalPackage.scripts,
						...expoPackage.scripts
					},
					dependencies: {
						...originalPackage.dependencies,
						...expoPackage.dependencies
					},
					devDependencies: {
						...originalPackage.devDependencies,
						...expoPackage.devDependencies
					}
				};

				// Write the merged package.json
				fs.writeFileSync('package.json', JSON.stringify(mergedPackage, null, 2));

				console.log('📦 Update metro.config.js to expo.config.js');

				if (fs.existsSync('metro.config.js')) {
					// For Unix-like systems - using fs instead of sed
					const metroConfig = fs.readFileSync('metro.config.js', 'utf8');
					const pathImport = 'const path = require("path");\n';
					const storybookConfig = `
defaultConfig.transformer.unstable_allowRequireContext = true;
const { generate } = require("@storybook/react-native/scripts/generate");

generate({
  configPath: path.resolve(__dirname, "./.storybook"),
  useJs: true,
});
`;
					// Add path import at the beginning
					let newContent = pathImport + metroConfig;
					
					// Find the position to insert storybook config (after defaultConfig assignment)
					const lines = newContent.split('\n');
					const configIndex = lines.findIndex(line => line.includes('const defaultConfig =')) + 1;
					
					// Insert the storybook config
					lines.splice(configIndex, 0, storybookConfig);
					newContent = lines.join('\n');
					
					fs.writeFileSync('metro.config.js', newContent, 'utf8');
				}

				console.log('📦 Update babel.config.js');

				// Add babel.config.js modification
				if (fs.existsSync('babel.config.js')) {
					const babelConfig = fs.readFileSync('babel.config.js', 'utf8');
					const updatedBabelConfig = babelConfig.replace(
						/presets:\s*\[\s*['"]module:@react-native\/babel-preset['"]\s*\]/,
						"presets: ['babel-preset-expo']"
					);
					fs.writeFileSync('babel.config.js', updatedBabelConfig);
				}

				// Update tsconfig.json
				if (fs.existsSync('tsconfig.json')) {
					const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
					if (!tsConfig.include) {
						tsConfig.include = [];
					}
					if (!tsConfig.include.includes('app.config.ts')) {
						tsConfig.include.push('app.config.ts');
					}
					if (!tsConfig.include.includes('App.js')) {
						tsConfig.include.push('App.js'); 
					}
					fs.writeFileSync('tsconfig.json', JSON.stringify(tsConfig, null, 2));
				}

				// Update app.json
				console.log('📦 Update app.json');
				if (fs.existsSync('app.json')) {
					// get app name from app.json first then replace app.json by expo specific app.json
					const appConfigOriginal = JSON.parse(fs.readFileSync('app.json', 'utf8'));
					const appName = appConfigOriginal.name;
					const appConfig = {
						expo: {
							name: appName,
							slug: appName
						}
					};
					fs.writeFileSync('app.json', JSON.stringify(appConfig, null, 2));
				}

				console.log('📦 Clearing resources for expo setup...');

				// Remove directories and files
				fs.rmSync('android', { recursive: true, force: true });
				fs.rmSync('ios', { recursive: true, force: true });
				fs.rmSync('.bundle', { recursive: true, force: true });
				if (fs.existsSync('Gemfile')) {
					fs.unlinkSync('Gemfile');
				}
				if (fs.existsSync('Gemfile.lock')) {
					fs.unlinkSync('Gemfile.lock');
				}
				if (fs.existsSync('yarn.lock')) {
					fs.unlinkSync('yarn.lock');
				}

				try {
					console.log('♻️  Replacing source...');

					if (fs.existsSync('index.js')) {
						fs.unlinkSync('index.js'); // Remove the index.js file
					}

					console.log('📦 Installing expo dependencies...');
					execSync(`${packageManager} install`, { stdio: 'inherit' });

					// Append to .gitignore
					const gitignorePath = '.gitignore'
					const gitignoreContent =
						'\n# for expo managed workflow\nios/\nandroid/\n.expo/\n';

					if (fs.existsSync(gitignorePath)) {
						fs.appendFileSync(gitignorePath, gitignoreContent);
					} else {
						fs.writeFileSync(gitignorePath, gitignoreContent);
					}
				} catch (error) {
					console.error(
						'🚨 Failed to copy assets or replace source. If you are using Windows, please use Git Bash.',
					);
					process.exit(1);
				}
			} else {
				[
					'*.expo.*',
					'assets',
					'App.js',
					'react-native.config.js',
					'app.config.ts',
					'yarn.expo.lock',
				].forEach(file => {
					if (fs.existsSync(file)) {
						rimraf.sync(file);
					}
				});
			}

			resolve();
		});
	},
};
