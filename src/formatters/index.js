import getPlainFormat from './plain.js';
import getStylishFormat from './stylish.js';
import getJSONFormat from './json.js';

const getFormattedDiff = (diffObject, format) => {
  let result;
  switch (format) {
    case 'stylish':
      result = getStylishFormat(diffObject, '    ');
      break;
    case 'plain':
      result = getPlainFormat(diffObject);
      break;
    case 'json':
      result = getJSONFormat(diffObject);
      break;
    default:
      result = getStylishFormat(diffObject, '    ');
  }
  console.log(result);
  return result;
};

export default getFormattedDiff;
