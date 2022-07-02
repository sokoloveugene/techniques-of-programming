const { ApiBuilder } = require("./api-builder.js");
const { schema } = require("./api.schema.js");

const domains = {
  api_v1: "http://localhost:4200/api",
  api_v2: "http://localhost:8000",
};

const api = ApiBuilder.setDomains(domains).from(schema);

api.client.get({
  id: 123,
});

api.client.update({
  id: 123,
  isPrimary: true,
  payload: { age: 18, hobby: "Java" },
});

api.product.add.primary({
  hasSubproducts: true,
  productType: "pants",
  payload: { size: "S", color: "black" },
});
