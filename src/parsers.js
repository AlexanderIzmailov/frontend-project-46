const checkPresenceSecondKey = (object, key, firstValue) => {
  if (key in object) {
    const secondValue = object[key];
    return firstValue === secondValue ? 'similar' : 'different';
  }
  return 'onlyFirst';
};

const makeDiffObject = (data1, data2, tree = {}, isSecondIteration = false) => {
  const diff = 'children' in tree ? { ...tree } : { children: [] };

  const alreadyExist = diff.children.map((item) => item.key);
  const presence = isSecondIteration ? 'onlySecond' : 'onlyFirst';

  /* eslint-disable-next-line */
  for (const [key, firstValue] of Object.entries(data1)) {
    if (alreadyExist.indexOf(key) >= 0) {
      /* eslint-disable-next-line */
      continue;
    }

    let newDiffItem = {};

    const checkSecondKey = checkPresenceSecondKey(data2, key, firstValue);
    switch (checkSecondKey) { // eslint-disable-line
      case 'onlyFirst':
        newDiffItem = {
          key, value: firstValue, presence, children: [],
        };
        break;
      case 'different':
        newDiffItem = {
          key, firstValue, secondValue: data2[key], presence: 'bothDifferent', children: [],
        };
        break;
      case 'similar':
        newDiffItem = {
          key, value: firstValue, presence: 'bothSame', children: [],
        };
    }

    // let newDiffItem = {}
    // if (key in data2) {
    //   const secondValue = data2[key]

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

  const result = isSecondIteration ? diff : makeDiffObject(data2, data1, diff, true);

  return result;
};

export default makeDiffObject;
