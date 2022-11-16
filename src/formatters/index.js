import getPlainFormat from './plain.js';
import getStylishFormat from './stylish.js';
import getJSONFormat from './json.js';

const getDiff = (diffObject, format) => {
  switch (format) {
    case 'stylish':
      return getStylishFormat(diffObject, '    ');
    case 'plain':
      return getPlainFormat(diffObject);
    case 'json':
      return getJSONFormat(diffObject);
    default:
      return getStylishFormat(diffObject, '    ');
  }
};

const getFormattedDiff = (diffObject, format) => {
  const result = getDiff(diffObject, format);
  console.log(result);

  return result;
};

export default getFormattedDiff;
