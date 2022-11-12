import * as fs from 'fs';
import yaml from 'js-yaml';
import makeDiffObject from './parsers.js';

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

const makeConsoleDiff = (file1, file2) => {
  const dataFile1 = readData(file1);
  const dataFile2 = readData(file2);

  const diffObject = makeDiffObject(dataFile1, dataFile2);

  const result = diffObject.children
    .sort((a, b) => {
      const keyA = a.key.toUpperCase();
      const keyB = b.key.toUpperCase();
      if (keyA < keyB) {
        return -1;
      }
      if (keyA > keyB) {
        return 1;
      }
      return 0;
    })
    .map((item) => {
      const { key, presence } = item;
      let resultRow;
      switch (presence) { // eslint-disable-line
        case 'onlyFirst':
          resultRow = `  - ${key}: ${item.value}`;
          break;
        case 'onlySecond':
          resultRow = `  + ${key}: ${item.value}`;
          break;
        case 'bothDifferent':
          resultRow = `  - ${key}: ${item.firstValue}\n  + ${key}: ${item.secondValue}`;
          break;
        case 'bothSame':
          resultRow = `    ${key}: ${item.value}`;
      }
      return resultRow;
    });

  console.log(`{\n${result.join('\n')}\n}`);
  return `{\n${result.join('\n')}\n}`;
};

export default makeConsoleDiff;
