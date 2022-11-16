import _ from 'lodash';
import { isObject, hasTwoValues } from '../parsers.js';

const checkValue = (value) => {
  if (isObject(value)) {
    return '[complex value]';
  }

  // switch (value) {
  //   case (null):
  //   case (true):
  //   case (false):
  //     return value;
  //   default:
  //     return typeof(value) === 'number' ? value : `'${value}'`;
  // }

  switch (true) {
    case (value === null):
    case (value === true):
    case (value === false):
    case (typeof (value) === 'number'):
      return value;
    default:
      return `'${value}'`;
  }
};

const getValue = (object) => {
  if (hasTwoValues(object)) {
    return [checkValue(object.firstValue), checkValue(object.secondValue)];
  }
  return checkValue(object.value);
};

const getPath = (path, key) => (path === '' ? `${key}` : `${path}.${key}`);

const getPlainFormat = (object, path = '') => {
  const sortedKeysOfDiff = _.sortBy(Object.keys(object));

  const result = sortedKeysOfDiff.map((key) => {
    const currentObject = object[key];
    const { presence } = currentObject;
    const formattedValue = getValue(currentObject);
    const property = getPath(path, key);

    switch (presence) { // eslint-disable-line
      case 'onlySecond':
        return `Property '${property}' was added with value: ${formattedValue}`;
      case 'onlyFirst':
        return `Property '${property}' was removed`;
      case 'differentSingle':
        return `Property '${property}' was updated. From ${formattedValue[0]} to ${formattedValue[1]}`;
      case 'differentObjects':
        return getPlainFormat(currentObject.value, getPath(path, key));
      default:
        return null;
    }
  }).filter((a) => a); // filter for empty values
  return result.join('\n');
};

export default getPlainFormat;
