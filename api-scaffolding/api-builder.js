const { axios } = require("./axios-mock.js");
const { isQuery } = require("./query.js");

const compose =
  (...fns) =>
  (arg) =>
    fns.reduce((composed, f) => f(composed), arg);

class ApiBuilder {
  static domains = {};

  static setDomains(map) {
    this.domains = map;
    return ApiBuilder;
  }

  static from(schema) {
    return new ApiBuilder(schema);
  }

  constructor(schema) {
    this.api = {};
    this.buildApi(schema);
    return this.api;
  }

  buildApi(schema, reference = this.api) {
    for (const [key, value] of Object.entries(schema)) {
      if (isQuery(value)) reference[key] = this.createHandler(value);
      else this.buildApi(value, (reference[key] = {}));
    }
  }

  createHandler(query) {
    return async (params = {}) => {
      const { method, url, payload, handler, config } = this.preprocess(
        query,
        params
      );

      return axios[method]
        .apply(null, query.hasPayload ? [url, payload, config] : [url, config])
        .then(handler);
    };
  }

  preprocess(query, parameters = {}) {
    return {
      method: query.method,
      url: query.url.replace(/{{(.*?)}}/g, (match, $1) => {
        const [param] = $1.split(":"); // param:boolean
        return parameters[param] ?? ApiBuilder.domains[param];
      }),
      payload: parameters.payload,
      config: parameters.config,
      handler: compose(...query.handlers),
    };
  }
}

module.exports = { ApiBuilder };
