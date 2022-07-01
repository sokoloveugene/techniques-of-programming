const axios = {
  get: (url) => Promise.resolve(`AXIOS get on, ${url}`),
  delete: (url) => Promise.resolve(`AXIOS delete on, ${url}`),
  post: (url, data) =>
    Promise.resolve(`AXIOS post on, ${url} with ${JSON.stringify(data)}`),
  put: (url, data) =>
    Promise.resolve(`AXIOS put on, ${url} with ${JSON.stringify(data)}`),
  patch: (url, data) =>
    Promise.resolve(`AXIOS patch on, ${url} with ${JSON.stringify(data)}`),
};

class ApiBuilder {
  static methods = {
    GET: "get",
    DELETE: "delete",
    POST: "post",
    PUT: "put",
    PATCH: "patch",
  };
  static domains = {};
  static handlers = {};

  static setDomains(map) {
    this.domains = map;
    return ApiBuilder;
  }

  static setHandlers(map) {
    this.handlers = map;
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
      const isGroup = typeof value === "object";

      if (isGroup) this.buildApi(value, (reference[key] = {}));
      else reference[key] = this.createHandler(value);
    }
  }

  createHandler(template) {
    this.validate(template);
    return async (params = {}) => {
      const { httpMethod, url, payload, handler } = this.preprocess(
        template,
        params
      );

      return axios[httpMethod](url, payload).then(handler);
    };
  }

  preprocess(template, parameters = {}) {
    const [method, url, arrow, ...fnNames] = template.split(/\s+/);

    return {
      httpMethod: ApiBuilder.methods[method],
      url: url.replace(/{{(.*?)}}/g, (match, $1) => {
        const [param] = $1.split(":");
        return parameters[param] ?? ApiBuilder.domains[param];
      }),
      payload: parameters.payload,
      handler: this.getComposedHandler(fnNames),
    };
  }

  getComposedHandler(fnNames) {
    const handlers = fnNames.map((name) => ApiBuilder.handlers[name]);
    return (arg) => handlers.reduce((composed, f) => f(composed), arg);
  }

  get templateRegex() {
    const methods = Object.keys(ApiBuilder.methods).join("|");
    const domains = Object.keys(ApiBuilder.domains).join("|");
    const handlers = Object.keys(ApiBuilder.handlers).join("\\b|");

    const METHOD = `(${methods})`;
    const DOMAIN = `{{(${domains})}}`;
    const PATH = "[\\w\\/{}:\\=\\?\\&]*";
    const END = "$";
    const HANDLER = `\\s+=>\\s+(\\b${handlers}\\b|\\s){1,}$`;

    return new RegExp(`${METHOD}\\s+${DOMAIN}${PATH}(${END}|${HANDLER})`);
  }

  logError(template) {
    const color = "\x1b[33m%s\x1b[0m";

    console.log(color, "Definition is not correct");
    console.log(color, template);
    console.log(color, "Please make sure that");

    console.table({
      Method: `One of: ${Object.keys(ApiBuilder.methods).join(", ")}`,
      Domain: `One of: ${Object.keys(ApiBuilder.domains).join(", ")}`,
      Handler: `One of: ${Object.keys(ApiBuilder.handlers).join(", ")}`,
      Space: `METHOD {{DOMAIN}}/PATH => HANDLER1 HANDLER2`,
      Arrow: "=>",
    });

    throw new Error("Can not parse api template");
  }

  validate(template) {
    const isValid = this.templateRegex.test(template);
    if (!isValid) this.logError(template);
  }
}

module.exports = { ApiBuilder };
