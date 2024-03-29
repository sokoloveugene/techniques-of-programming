const { ApiBuilder } = require("./api-builder.js");
const { schema } = require("./api.schema.js");

const domains = {
  api_v1: "http://localhost:4200/api",
  api_v2: "http://localhost:8000",
};

const api = ApiBuilder.setDomains(domains).from(schema);

// AXIOS get on, http://localhost:4200/api/customer/123 DECORATED TO JSON
api.client.get({
  id: 123,
  config: { headers: { "X-Requested-With": "XMLHttpRequest" } },
});

// AXIOS patch on, http://localhost:8000/customer/123?primary=true with {"age":18,"hobby":"Java"}
api.client.update({
  id: 123,
  isPrimary: true,
  payload: { age: 18, hobby: "Java" },
});

// AXIOS put on, http://localhost:8000/product/primary/pants?subproducts=true with {"size":"S","color":"black"}
api.product.add.primary({
  hasSubproducts: true,
  productType: "pants",
  payload: { size: "S", color: "black" },
  config: { headers: { "X-Requested-With": "XMLHttpRequest" } },
});
