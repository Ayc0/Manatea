#!/usr/bin/env node

const [_, __, ...argv] = process.argv;

const versionIndex = argv.findIndex(arg => arg === '-v' || arg === '--version');
if (versionIndex === argv.length - 1 || versionIndex === -1) {
  return;
}

const version = argv[versionIndex + 1];
argv.splice(versionIndex, 2);

const cp = require('child_process');
const path = require('path');

deploy('manatea');
cp.spawnSync('git', ['tag', '-d', `v${version}`], {
  stdio: 'inherit',
});
deploy('react-manatea');

function deploy(package) {
  cp.spawnSync('yarn', ['publish', '--new-version', version, ...argv], {
    cwd: path.join(__dirname, 'packages', package),
    stdio: 'inherit',
  });
}
