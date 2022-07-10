const isObject = (val) => val && typeof val === "object";
const isNullOrUndefined = (val) => val === null || val === undefined;
const isUndefined = (val) => val === undefined;

const get = (obj, path, defaultValue) => {
  if (!path || !isObject(obj)) {
    return defaultValue;
  }

  const chunks = path.split(/[,[\].]+?/).filter(Boolean);

  const result = chunks.reduce(
    (result, key) => (isNullOrUndefined(result) ? result : result[key]),
    obj
  );

  return isUndefined(result) || result === obj
    ? isUndefined(obj[path])
      ? defaultValue
      : obj[path]
    : result;
};

module.exports = {
  get,
};
