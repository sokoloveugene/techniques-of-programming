const METHODS = {
  GET: "get",
  DELETE: "delete",
  POST: "post",
  PUT: "put",
  PATCH: "patch",
};

const TYPE = "__query__";

const query = (method, [template], ...handlers) => {
  const [url] = template.split(/\s+/);

  return {
    type: TYPE,
    hasPayload: [METHODS.POST, METHODS.PUT, METHODS.PATCH].includes(method),
    method,
    url,
    handlers: handlers.filter((f) => typeof f === "function"),
  };
};

module.exports = {
  GET: query.bind(null, METHODS.GET),
  POST: query.bind(null, METHODS.POST),
  PUT: query.bind(null, METHODS.PUT),
  PATCH: query.bind(null, METHODS.PATCH),
  DELETE: query.bind(null, METHODS.DELETE),
  isQuery: (val) =>
    Boolean(val) && typeof val === "object" && val["type"] === TYPE,
};
