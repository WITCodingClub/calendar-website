import { spawnSync } from 'node:child_process';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const root = fileURLToPath(new URL('../', import.meta.url));

function run(command, args, cwd) {
	const result = spawnSync(command, args, { cwd, stdio: 'inherit' });
	if (result.error) throw result.error;
	if (result.status !== 0) process.exit(result.status ?? 1);
}

async function requireFile(filename, message) {
	await access(filename).catch(() => {
		throw new Error(message);
	});
}

try {
	const { values } = parseArgs({
		options: {
			extension: { type: 'string' },
			build: { type: 'boolean', default: false },
			help: { type: 'boolean', short: 'h' }
		}
	});

	if (values.help) {
		console.log(`Usage: npm run screenshots -- [--extension <path>] [--build]

  --extension <path>  Extension checkout (default: ../calendar-extension).
                     Relative paths resolve from your current directory.
  --build             Run npm run build-dev before capturing.
                      Otherwise, reuse the checkout's existing extension/ build.

Install dependencies and Chromium in the extension checkout first:
  npm ci
  npx playwright install chromium`);
	} else {
		const extension = values.extension
			? path.resolve(values.extension)
			: path.resolve(root, '../calendar-extension');
		const script = path.join(extension, 'scripts/screenshot.js');
		const config = path.join(root, 'scripts/screenshotConfig/config.json');
		const output = path.join(root, 'static/guides/getting-started');

		await requireFile(script, `Screenshot tool not found at ${script}. Use --extension <path>.`);
		await requireFile(config, `Website screenshot config not found at ${config}.`);
		JSON.parse(await readFile(config, 'utf8'));

		if (values.build) {
			console.log(`Building extension in ${extension}`);
			if (process.env.npm_execpath) {
				run(process.execPath, [process.env.npm_execpath, 'run', 'build-dev'], extension);
			} else if (process.platform === 'win32') {
				run(process.env.ComSpec || 'cmd.exe', ['/d', '/s', '/c', 'npm run build-dev'], extension);
			} else {
				run('npm', ['run', 'build-dev'], extension);
			}
		}

		await requireFile(
			path.join(extension, 'extension/manifest.json'),
			'No extension build found. Rerun with --build, or run npm run build-dev in the extension checkout.'
		);
		console.log(`Capturing with ${config}`);
		run(process.execPath, [script, '--config', config, '--out', output], extension);
	}
} catch (error) {
	console.error(error.message);
	process.exitCode = 1;
}
