const { ApiBuilder } = require("./api-builder.js");
const { schema } = require("./api.schema.js");

const domains = {
  api_v2: "http://localhost:8000",
  api_v1: "http://localhost:4200/api",
};

const handlers = {
  RES_DATA: (res) => `${res} DECORATED WITH RES_DATA`,
  API_RESPONSE: (data) => `${data} DECORATED WITH API_RESPONSE`,
  LOG: (data) => (console.log(data), data),
};

const api = ApiBuilder.setDomains(domains).setHandlers(handlers).from(schema);

// AXIOS get on  http://localhost:4200/api/customer/123
api.client.get({
  id: 123,
});

// AXIOS post on  http://localhost:8000/customer/123?primary=true  with  { age: 18, hobby: 'Java' }
api.client.update({
  id: 123,
  isPrimary: true,
  payload: { age: 18, hobby: "Java" },
});

// AXIOS post on  http://localhost:8000/product/primary/pants?subproducts=true  with  { size: 'S', color: 'black' }
api.product.add.primary({
  hasSubproducts: true,
  productType: "pants",
  payload: { size: "S", color: "black" },
});
