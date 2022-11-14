import _ from 'lodash';

// const checkPresenceSecondKey = (object, key, firstValue) => {
//   if (key in object) {
//     const secondValue = object[key];
//     return firstValue === secondValue ? 'similar' : 'different';
//   }
//   return 'onlyFirst';
// };

// const makeDiffObject = (data1, data2, tree = {}, isSecondIteration = false) => {
//   const diff = 'children' in tree ? { ...tree } : { children: [] };

//   const alreadyExist = diff.children.map((item) => item.key);
//   const presence = isSecondIteration ? 'onlySecond' : 'onlyFirst';

//   /* eslint-disable-next-line */
//   for (const [key, firstValue] of Object.entries(data1)) {
//     if (alreadyExist.indexOf(key) >= 0) {
//       /* eslint-disable-next-line */
//       continue;
//     }

//     let newDiffItem = {};

//     const checkSecondKey = checkPresenceSecondKey(data2, key, firstValue);
//     switch (checkSecondKey) { // eslint-disable-line
//       case 'onlyFirst':
//         newDiffItem = {
//           key, value: firstValue, presence, children: [],
//         };
//         break;
//       case 'different':
//         newDiffItem = {
//           key, firstValue, secondValue: data2[key], presence: 'bothDifferent', children: [],
//         };
//         break;
//       case 'similar':
//         newDiffItem = {
//           key, value: firstValue, presence: 'bothSame', children: [],
//         };
//     }

//     // let newDiffItem = {}
//     // if (key in data2) {
//     //   const secondValue = data2[key]

//     //   if (firstValue === secondValue) {
//     //     newDiffItem = {key, value: firstValue, presence:'bothSame', children:[]}
//     //   } else {
//     //     newDiffItem = {key, firstValue, secondValue, presence:'bothDifferent', children:[]}
//     //   }

//     // } else {
//     //   newDiffItem = {key, value: firstValue, presence, children:[]}
//     // }

//     diff.children.push(newDiffItem);
//   }

//   const result = isSecondIteration ? diff : makeDiffObject(data2, data1, diff, true);

//   return result;
// };

// const checkPresenceKeys1 = (key, data1, data2) => {
//   const firstValue = data1[key];
//   if (key in data2) {
//     const secondValue = data2[key];
//     return _.isEqual(firstValue, secondValue) ? 'similar' : 'different';
//   }
//   return 'onlyFirst';
// };

export const isObject = (value) => _.isObject(value) && !_.isArray(value) && value !== null;

// const checkPresenceKeys2 = (key, data1, data2) => {
//   if (!(key in data2)) {
//     console.log(key)
//     return 'onlyFirst'
//   }

//   const [ firstValue, secondValue ] = [ data1[key], data2[key] ];

//   if (isObject(firstValue) && isObject(secondValue)) {
//     return _.isEqual(firstValue, secondValue) ? 'similarObjects' : 'differentObjects';
//   }

//   return _.isEqual(firstValue, secondValue) ? 'similar' : 'different';
// };

const checkPresenceKey = (key, data1, data2) => {
  if (!(key in data2)) {
    return 'onlyFirst';
  }

  const [firstValue, secondValue] = [data1[key], data2[key]];
  let similarResult;
  let differentResult;

  if (isObject(firstValue) && isObject(secondValue)) {
    [similarResult, differentResult] = ['similarObjects', 'differentObjects'];
  } else {
    [similarResult, differentResult] = ['similarSingle', 'differentSingle'];
  }

  return _.isEqual(firstValue, secondValue) ? similarResult : differentResult;
};

export const makeDiffObject = (data1, data2, tree = {}, isSecondIteration = false) => {
  const diff = { ...tree };

  /* eslint-disable-next-line */
  for (const [key, value] of Object.entries(data1)) {
    /* eslint-disable-next-line */
    if (isSecondIteration && key in diff) continue;

    const secondValue = key in data2 ? data2[key] : undefined;

    let newDiffItem;
    const presence = checkPresenceKey(key, data1, data2);
    switch (presence) { // eslint-disable-line
      case 'onlySecond':
      case 'onlyFirst':
        newDiffItem = { key, value, presence: isSecondIteration ? 'onlySecond' : 'onlyFirst' };
        break;
      case 'similarObjects':
      case 'similarSingle':
        newDiffItem = { key, value, presence };
        break;
      case 'differentSingle':
        newDiffItem = { key, firstValue: value, secondValue, presence };  // eslint-disable-line
        break;
      case 'differentObjects':
        newDiffItem = { key, value: makeDiffObject(value, secondValue), presence };
    }

    diff[key] = newDiffItem;
  }

  const result = isSecondIteration ? diff : makeDiffObject(data2, data1, diff, true);
  return result;
};

export default makeDiffObject;
