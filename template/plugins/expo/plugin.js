// eslint-disable-next-line @typescript-eslint/no-var-requires
const { execSync } = require('child_process');

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
					'🚨 No package manager found. Please install yarn or npm.'
				);
				process.exit(1);
			}

			if (value) {
				console.log('\n');

				console.log('📦 Clearing resources for expo setup...');
				execSync('rm -rf android ios .bundle Gemfile Gemfile.lock', { stdio: 'pipe' });

				try {
					console.log('♻️  Replacing source...');
					execSync('mv tsconfig.expo.json tsconfig.json', { stdio: 'pipe' });
					execSync('mv babel.expo.config.js babel.config.js', { stdio: 'pipe' });
					execSync('mv package.expo.json package.json', { stdio: 'pipe' });
					execSync('mv app.expo.json app.json', { stdio: 'pipe' });
					execSync('rm index.js', { stdio: 'pipe' });
					// remove android and ios folders
					execSync('rm -rf android ios', { stdio: 'pipe' });

					console.log('📦 Installing expo dependencies...')
					execSync(`${packageManager} install`, { stdio: 'pipe' });
					execSync(`echo "# for expo managed workflow\nios/\nandroid/\n.expo/" >> .gitignore`, { stdio: 'pipe' });
				} catch (error) {
					console.error(
						'🚨 Failed to copy assets or replace source. If you are using windows, please use git bash.'
					);
					process.exit(1);
				}
			} else {
				execSync('rm *.expo.*', { stdio: 'pipe' });
				execSync('rm assets', { stdio: 'pipe' });
				execSync('rm App.js', { stdio: 'pipe' });
				execSync('rm react-native.config.js', { stdio: 'pipe' });
			}

			resolve();
		});
	},
};
