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

				console.log('📦 Clearing resources for expo setup...');

				// Remove directories and files
				rimraf.sync(path.join(__dirname, 'android'));
				rimraf.sync(path.join(__dirname, 'ios'));
				rimraf.sync(path.join(__dirname, '.bundle'));
				if (fs.existsSync('Gemfile')) {
					fs.unlinkSync('Gemfile');
				}
				if (fs.existsSync('Gemfile.lock')) {
					fs.unlinkSync('Gemfile.lock');
				}

				try {
					console.log('♻️  Replacing source...');

					// Replace the files
					fs.renameSync('tsconfig.expo.json', 'tsconfig.json');
					fs.renameSync('babel.expo.config.js', 'babel.config.js');
					fs.renameSync('package.expo.json', 'package.json');
					fs.renameSync('app.expo.json', 'app.json');

					if (fs.existsSync('index.js')) {
						fs.unlinkSync('index.js'); // Remove the index.js file
					}

					fs.renameSync('metro.expo.config.js', 'metro.config.js');

					console.log('📦 Installing expo dependencies...');
					execSync(`${packageManager} install`, { stdio: 'inherit' });

					// Append to .gitignore
					const gitignorePath = path.join(__dirname, '.gitignore');
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
