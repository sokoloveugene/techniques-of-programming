const { get } = require("./get.js");
const { set } = require("./set.js");

class Mapper {
  constructor(from = []) {
    this.from = from;
    this.mappers = [];
    this.destination = undefined;
    this.default = undefined;
  }

  setFunction(...fns) {
    this.mappers.push(...fns);
    return this;
  }

  setFallback(value) {
    this.default = value;
    return this;
  }

  setDestination(path) {
    if (!this.from.length) {
      this.from = [path];
    }
    return this;
  }

  execute(data) {
    const initial = this.from.map((key) => get(data, key));

    const [calculated] = this.mappers.reduce(
      (composed, f) => [f(...composed)],
      initial
    );

    return {
      value: calculated ?? this.default,
    };
  }
}

const pick = (...keys) => new Mapper(keys);

const convert = (schema, data) => {
  const result = {};

  for (const [destination, config] of Object.entries(schema)) {
    const { value } = config.setDestination(destination).execute(data);

    if (value !== undefined) {
      set(result, destination, value);
    }
  }

  return result;
};

module.exports = { pick, convert };
