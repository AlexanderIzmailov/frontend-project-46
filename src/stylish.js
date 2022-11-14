import _ from 'lodash';
import { isObject } from './parsers.js';

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

// const makeConsoleDiff = (file1, file2) => {
//   const dataFile1 = readData(file1);
//   const dataFile2 = readData(file2);

//   const diffObject = makeDiffObject(dataFile1, dataFile2);
//   console.log(`diffObject:\n${JSON.stringify(diffObject, null, 2)}`);

//   const sortedKeysOfDiff = _.sortBy(Object.keys(diffObject));

//   const result = [];
//   sortedKeysOfDiff.forEach((key) => {
//     const currentObject = diffObject[key];
//     const { presence } = currentObject;

//     let resultRow;
//     switch (presence) { // eslint-disable-line
//       case 'onlyFirst':
//         resultRow = `  - ${key}: ${currentObject.value}`;
//         break;
//       case 'onlySecond':
//         resultRow = `  + ${key}: ${currentObject.value}`;
//         break;
//       case 'differentSingle':
//         resultRow = `  - ${key}: ${currentObject.firstValue}\n
//                           + ${key}: ${currentObject.secondValue}`;
//         break;
//       case 'similarSingle':
//         resultRow = `    ${key}: ${currentObject.value}`;
//         break;
//     }

//     result.push(resultRow);
//   });

//   // const result = diffObject.children
//   //   .sort((a, b) => {
//   //     const keyA = a.key.toUpperCase();
//   //     const keyB = b.key.toUpperCase();
//   //     if (keyA < keyB) {
//   //       return -1;
//   //     }
//   //     if (keyA > keyB) {
//   //       return 1;
//   //     }
//   //     return 0;
//   //   })
//   //   .map((item) => {
//   //     const { key, presence } = item;
//   //     let resultRow;
//   //     switch (presence) { // eslint-disable-line
//   //       case 'onlyFirst':
//   //         resultRow = `  - ${key}: ${item.value}`;
//   //         break;
//   //       case 'onlySecond':
//   //         resultRow = `  + ${key}: ${item.value}`;
//   //         break;
//   //       case 'bothDifferent':
//   //         resultRow = `  - ${key}: ${item.firstValue}\n  + ${key}: ${item.secondValue}`;
//   //         break;
//   //       case 'bothSame':
//   //         resultRow = `    ${key}: ${item.value}`;
//   //     }
//   //     return resultRow;
//   //   });

//   console.log(`RESULT:\n{\n${result.join('\n')}\n}`);
//   return `{\n${result.join('\n')}\n}`;
// };

const getStrOfValue = (value, level = 0) => {
  if (!isObject(value)) {
    return value;
  }

  const indent = '    '.repeat(level + 1);
  const sortedKeysOfDiff = _.sortBy(Object.keys(value));
  const result = [];

  sortedKeysOfDiff.forEach((key) => {
    const resultRow = `${indent}    ${key}: ${getStrOfValue(value[key], level + 1)}`;
    result.push(resultRow);
  });

  return `{\n${result.join('\n')}\n${indent}}`;
};

const getPrefix = (object) => {
  switch (object.presence) {
    case 'onlyFirst':
      return '  - ';
    case 'onlySecond':
      return '  + ';
    case 'differentSingle':
      return ['  - ', '  + '];
    default:
      return '    ';
  }
};

const getValue = (object) => ('secondValue' in object) ? [object.firstValue, object.secondValue] : object.value;  // eslint-disable-line

const getStrOfObject = (object, gap, level = 0) => {
  const indent = gap.repeat(level);

  const sortedKeysOfDiff = _.sortBy(Object.keys(object));

  const result = [];

  sortedKeysOfDiff.forEach((key) => {
    const currentObject = object[key];
    const { presence } = currentObject;
    const prefix = getPrefix(currentObject);
    const value = getValue(currentObject);

    let resultRow;
    switch (presence) { // eslint-disable-line
      case 'onlyFirst':
      case 'onlySecond':
      case 'similarSingle':
        resultRow = `${indent}${prefix}${key}: ${getStrOfValue(value, level)}`;
        break;
      case 'differentSingle':
        resultRow = `${indent}${prefix[0]}${key}: ${getStrOfValue(value[0], level)}\n${indent}${prefix[1]}${key}: ${getStrOfValue(value[1], level)}`;
        break;
      case 'differentObjects':
      case 'similarObjects':
        resultRow = `${indent}${prefix}${key}: ${getStrOfObject(value, gap, level + 1)}`;
    }

    result.push(resultRow);
  });

  return `{\n${result.join('\n')}\n${indent}}`;
};

export default getStrOfObject;
