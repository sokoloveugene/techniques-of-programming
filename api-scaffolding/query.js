const METHODS = {
  GET: "get",
  DELETE: "delete",
  POST: "post",
  PUT: "put",
  PATCH: "patch",
};

const TYPE = "__query__";

const isQuery = (val) => {
  return Boolean(val) && typeof val === "object" && val["type"] === TYPE;
};

const isFunction = (v) => typeof v === "function";

const query = ([template], ...handlers) => {
  const [method, url] = template.split(/\s+/);

  const lambas = new Array(handlers.length).fill("[λ]").join(" ");

  return {
    type: TYPE,
    method: METHODS[method],
    url,
    handlers: handlers.filter(isFunction),
    template: `${template} ${lambas}`.replace(/\s{2,}/g, " "),
  };
};

module.exports = {
  query,
  isQuery,
  METHODS,
};
