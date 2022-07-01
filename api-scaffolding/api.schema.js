const schema = {
  heartbeat: "GET {{api_v1}}/heartbeat => RES_DATA LOG",
  client: {
    get: "GET {{api_v1}}/customer/{{id:number}} => RES_DATA LOG",
    update:
      "POST {{api_v2}}/customer/{{id:number}}?primary={{isPrimary:boolean}} => LOG",
  },
  product: {
    delete:
      "DELETE {{api_v1}}/product/{{productId:number}}/{{productType:string}} => LOG",
    add: {
      primary:
        "POST {{api_v2}}/product/primary/{{productType:string}}?subproducts={{hasSubproducts:boolean}} => LOG",
      default:
        "POST {{api_v2}}/product/default/{{productType:string}}?subproducts={{hasSubproducts:boolean}} => LOG",
    },
  },
};

module.exports = { schema };
