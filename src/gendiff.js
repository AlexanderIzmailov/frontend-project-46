import * as fs from 'fs';
import yaml from 'js-yaml';
import { makeDiffObject } from './parsers.js';
import getFormattedDiff from './formatters/index.js';

// const file1 = {
//   "host": "hexlet.io",
//   "timeout": 50,
//   "proxy": "123.234.53.22",
//   "follow": false
// };

// const file2 = {
//   "timeout": 20,
//   "verbose": true,
//   "host": "hexlet.io"
// };

const readData = (file) => {
  const fileExtension = file.split('.').pop();

  switch (fileExtension) {
    case 'json':
      return JSON.parse(fs.readFileSync(file));
    case 'yaml':
    case 'yml':
      return yaml.load(fs.readFileSync(file));
    default:
      return JSON.parse(fs.readFileSync(file));
  }
};

const makeDiff = (file1, file2, format = 'stylish') => {
  const dataFile1 = readData(file1);
  const dataFile2 = readData(file2);

  const diffObject = makeDiffObject(dataFile1, dataFile2);
  const result = getFormattedDiff(diffObject, format);
  return result;
};

export default makeDiff;
