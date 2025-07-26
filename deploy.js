#!/usr/bin/env node

const cp = require('child_process');
const fs = require('fs');
const path = require('path');

const [_, __, ...argv] = process.argv;

const versionIndex = argv.findIndex(arg => arg === '-v' || arg === '--version');
if (versionIndex === argv.length - 1 || versionIndex === -1) {
  return;
}

const version = argv[versionIndex + 1];
argv.splice(versionIndex, 2);

updateAllVersions(version);
deploy('manatea');
deploy('react-manatea');
commit(version);
addTag(version);
push();

function* listAllWorkspaces() {
  const output = cp.spawnSync('pnpm', ['-r', 'exec', 'pwd'], {
    encoding: 'utf-8',
  }).stdout;
  const paths = output.trim().split('\n');

  for (const p of paths) {
    const packageJsonPath = path.join(p, 'package.json');
    const packageJson = JSON.parse(
      fs.readFileSync(packageJsonPath, { encoding: 'utf-8' }),
    );

    yield { packageJsonPath, packageJson, name: packageJson.name };
  }
}

function updateAllVersions(version) {
  for (const { packageJson, packageJsonPath } of listAllWorkspaces()) {
    packageJson.version = version;
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + '\n',
    );
  }
}

function deploy(package) {
  cp.spawnSync('pnpm', ['publish', ...argv], {
    cwd: path.join(__dirname, 'packages', package),
    stdio: 'inherit',
  });
}

function addTag(version) {
  cp.spawnSync('git', ['tag', `v${version}`], { stdio: 'inherit' });
}

function commit(version) {
  cp.spawnSync('git', ['add', '.'], { stdio: 'inherit' });
  cp.spawnSync('git', ['commit', '-m', `v${version}`], { stdio: 'inherit' });
}

function push() {
  cp.spawnSync('git', ['push'], { stdio: 'inherit' });
  cp.spawnSync('git', ['push', '--tags'], { stdio: 'inherit' });
}
