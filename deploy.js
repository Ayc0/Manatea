#!/usr/bin/env node

const cp = require('child_process');
const path = require('path');

const [_, __, ...argv] = process.argv;

const versionIndex = argv.findIndex(arg => arg === '-v' || arg === '--version');
if (versionIndex === argv.length - 1 || versionIndex === -1) {
  return;
}

const version = argv[versionIndex + 1];
argv.splice(versionIndex, 2);

deploy('manatea');
removeTag(version);
deploy('react-manatea');
removeTag(version);
mergeLast2Commits(version);
addTag(version);
push();

function deploy(package) {
  cp.spawnSync('yarn', ['publish', '--new-version', version, ...argv], {
    cwd: path.join(__dirname, 'packages', package),
    stdio: 'inherit',
  });
}

function removeTag(version) {
  cp.spawnSync('git', ['tag', '-d', `v${version}`], {
    stdio: 'inherit',
  });
}

function addTag(version) {
  cp.spawnSync('git', ['tag', `v${version}`], {
    stdio: 'inherit',
  });
}

function mergeLast2Commits(version) {
  cp.spawnSync('git', ['reset', 'HEAD~2'], {
    stdio: 'inherit',
  });
  cp.spawnSync('git', ['add', '.'], {
    stdio: 'inherit',
  });
  cp.spawnSync('git', ['commit', '-m', `v${version}`], {
    stdio: 'inherit',
  });
}

function push() {
  cp.spawnSync('git', ['push'], {
    stdio: 'inherit',
  });
  cp.spawnSync('git', ['push', '--tags'], {
    stdio: 'inherit',
  });
}
