const { GET, POST, PUT, PATCH, DELETE } = require("./query.js");

const Fn = {
  json: (res) => `${res} DECORATED TO JSON`,
  log: (data) => (console.log(data), data),
};

const schema = {
  heartbeat: GET`{{api_v2}}/heartbeat => ${Fn.json} ${Fn.log}`,
  client: {
    get: GET`{{api_v1}}/customer/{{id:number}} => ${Fn.json} ${Fn.log}`,
    update: PATCH`{{api_v2}}/customer/{{id:number}}?primary={{isPrimary:boolean}} => ${Fn.log}`,
  },
  product: {
    delete: DELETE`{{api_v1}}/product/{{productId:number}}/{{productType:string}}`,
    add: {
      primary: PUT`{{api_v2}}/product/primary/{{productType:string}}?subproducts={{hasSubproducts:boolean}} => ${Fn.log}`,
      default: POST`{{api_v2}}/product/default/{{productType:string}}?subproducts={{hasSubproducts:boolean}}`,
    },
  },
};

module.exports = { schema };
