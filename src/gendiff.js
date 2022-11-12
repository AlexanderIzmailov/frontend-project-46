import * as fs from 'fs';

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

const checkPresenceSecondKey = (object, key, firstValue) => {
  if (key in object) {
    const secondValue = object[key];
    return firstValue === secondValue ? 'similar' : 'different';
  }
  return 'onlyFirst';
};

const makeDiffObject = (file1, file2, tree = {}, isSecondIteration = false) => {
  const diff = 'children' in tree ? { ...tree } : { children: [] };

  const alreadyExist = diff.children.map((item) => item.key);
  const presence = isSecondIteration ? 'onlySecond' : 'onlyFirst';

  /* eslint-disable-next-line */
  for (const [key, firstValue] of Object.entries(file1)) {
    if (alreadyExist.indexOf(key) >= 0) {
      /* eslint-disable-next-line */
      continue;
    }

    let newDiffItem = {};

    const checkSecondKey = checkPresenceSecondKey(file2, key, firstValue);
    switch (checkSecondKey) { // eslint-disable-line
      case 'onlyFirst':
        newDiffItem = {
          key, value: firstValue, presence, children: [],
        };
        break;
      case 'different':
        newDiffItem = {
          key, firstValue, secondValue: file2[key], presence: 'bothDifferent', children: [],
        };
        break;
      case 'similar':
        newDiffItem = {
          key, value: firstValue, presence: 'bothSame', children: [],
        };
    }

    // let newDiffItem = {}
    // if (key in file2) {
    //   const secondValue = file2[key]

    //   if (firstValue === secondValue) {
    //     newDiffItem = {key, value: firstValue, presence:'bothSame', children:[]}
    //   } else {
    //     newDiffItem = {key, firstValue, secondValue, presence:'bothDifferent', children:[]}
    //   }

    // } else {
    //   newDiffItem = {key, value: firstValue, presence, children:[]}
    // }

    diff.children.push(newDiffItem);
  }

  const result = isSecondIteration ? diff : makeDiffObject(file2, file1, diff, true);

  return result;
};

const takeData = (file) => {
  const splittedFileName = file.split('.');
  const fileExtension = splittedFileName[splittedFileName.length - 1];

  let data;
  switch (fileExtension) {
    case 'json':
      data = JSON.parse(fs.readFileSync(file));
      break;
    default:
      data = JSON.parse(fs.readFileSync(file));
  }

  return data;
};

const makeConsoleDiff = (file1, file2) => {
  const dataFile1 = takeData(file1);
  const dataFile2 = takeData(file2);

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
