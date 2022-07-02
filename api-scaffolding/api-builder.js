const { axios } = require("./axios-mock.js");
const { isQuery, METHODS } = require("./query.js");

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
    this.validate(query);
    return async (params = {}) => {
      const { method, url, payload, handler } = this.preprocess(query, params);

      return axios[method](url, payload).then(handler);
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
      handler: compose(...query.handlers),
    };
  }

  logError(template) {
    const color = "\x1b[33m%s\x1b[0m";

    console.log(color, "Definition is not correct");
    console.log(color, template);
    console.log(color, "Please make sure that");

    const domainsList = Object.keys(ApiBuilder.domains);

    console.table({
      Method: `One of: ${Object.keys(METHODS).join(", ")}`,
      Domain: `One of: ${domainsList.join(", ")}`,
      Example: `GET {{${domainsList[0]}}}/path/{{id:number}} => \${fn1} \${fn2}`,
    });

    throw new Error("Can not parse api template");
  }

  validate(query) {
    const domains = Object.keys(ApiBuilder.domains).join("|");
    const DOMAIN = `{{(${domains})}}`;
    const PATH = "[\\w\\/{}:\\=\\?\\&]*";

    const isValid =
      Boolean(query.method) && new RegExp(`${DOMAIN}${PATH}`).test(query.url);

    if (!isValid) this.logError(query.template);
  }
}

module.exports = { ApiBuilder };
