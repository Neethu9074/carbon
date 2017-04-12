#!/usr/bin/env node

/* eslint-env node */
/* eslint-disable no-console */

const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

try {
  fs.statSync(path.join(__dirname, '..', '..', 'yarn.lock'));
} catch (e) {
  console.log(chalk.red('yarn.lock does not seem to exist anymore. Did you delete it?'));
  console.log(chalk.gray('Stat error: ' + e.message));
  process.exit(1);
}
