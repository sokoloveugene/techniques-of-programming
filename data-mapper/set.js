const compact = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);
const isKey = (value) => /^\w*$/.test(value);
const isObject = (value) => Boolean(value) && typeof value === "object";
const stringToPath = (input) =>
  compact(input.replace(/["|']|\]/g, "").split(/\.|\[/));

const set = (object, path, value) => {
  let index = -1;
  const tempPath = isKey(path) ? [path] : stringToPath(path);
  const length = tempPath.length;
  const lastIndex = length - 1;

  while (++index < length) {
    const key = tempPath[index];
    let newValue = value;

    if (index !== lastIndex) {
      const objValue = object[key];
      newValue =
        isObject(objValue) || Array.isArray(objValue)
          ? objValue
          : !isNaN(+tempPath[index + 1])
          ? []
          : {};
    }
    object[key] = newValue;
    object = object[key];
  }
  return object;
};

module.exports = {
  set,
};
