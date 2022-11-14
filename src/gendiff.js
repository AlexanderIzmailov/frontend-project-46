import * as fs from 'fs';
import yaml from 'js-yaml';
import { makeDiffObject } from './parsers.js';
import getStylishFormat from './stylish.js';

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

  let data;
  switch (fileExtension) {
    case 'json':
      data = JSON.parse(fs.readFileSync(file));
      break;
    case 'yaml':
    case 'yml':
      data = yaml.load(fs.readFileSync(file));
      break;
    default:
      data = JSON.parse(fs.readFileSync(file));
  }

  return data;
};

const makeDiff = (file1, file2, format = 'stylish') => {
  const dataFile1 = readData(file1);
  const dataFile2 = readData(file2);

  const diffObject = makeDiffObject(dataFile1, dataFile2);
  let result;
  switch (format) {
    case 'stylish':
      result = getStylishFormat(diffObject, '    ');
      break;
    default:
      result = getStylishFormat(diffObject, '    ');
  }
  console.log(result);
  return result;
};

export default makeDiff;
