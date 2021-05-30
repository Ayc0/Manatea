#!/usr/bin/env node

const cp = require('child_process');
const path = require('path');

build('manatea');
build('react-manatea');

function build(package) {
  cp.spawnSync('yarn', ['build'], {
    cwd: path.join(__dirname, 'packages', package),
    stdio: 'inherit',
  });
}
