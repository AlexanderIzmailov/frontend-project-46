const getJSONFormat = (diffObject) => {
  return JSON.stringify(diffObject, null, 2);
}

export default getJSONFormat;
