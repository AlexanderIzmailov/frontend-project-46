import _ from 'lodash';
import { isObject, hasTwoValues } from '../parsers.js';

const checkValue = (value) => {
  if (isObject(value)) {
    return '[complex value]';
  }

  switch (value) {
    case (null):
    case (true):
    case (false):
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
  const result = [];

  sortedKeysOfDiff.forEach((key) => {
    const currentObject = object[key];
    const { presence } = currentObject;
    const formattedValue = getValue(currentObject);
    const property = getPath(path, key);

    let newRow;
    switch (presence) { // eslint-disable-line
      case 'onlySecond':
        newRow = `Property '${property}' was added with value: ${formattedValue}`;
        break;
      case 'onlyFirst':
        newRow = `Property '${property}' was removed`;
        break;
      case 'differentSingle':
        newRow = `Property '${property}' was updated. From ${formattedValue[0]} to ${formattedValue[1]}`;
        break;
      case 'differentObjects':
        newRow = getPlainFormat(currentObject.value, getPath(path, key));
    }

    if (newRow !== undefined) {
      result.push(newRow);
    }
  });
  return result.join('\n');
};

export default getPlainFormat;
