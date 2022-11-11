#!/usr/bin/env node

import { Command } from 'commander';
import makeConsoleDiff from '../src/gendiff.js';

const program = new Command();

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .option('-V, --version', 'output the version number')
  .option('-f, --format <type>', 'output format')
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2) => makeConsoleDiff(filepath1, filepath2));

program.parse();
