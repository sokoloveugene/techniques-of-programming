const schema = {
  heartbeat: "[GET] {{api_v1}}/heartbeat",
  client: {
    get: "[GET] {{api_v1}}/customer/{{id:number}}",
    update:
      "[POST] {{api_v2}}/customer/{{id:number}}?primary={{isPrimary:boolean}}",
  },
  product: {
    delete:
      "[DELETE] {{api_v1}}/product/{{productId:number}}/{{productType:string}}",
    add: {
      primary:
        "[POST] {{api_v2}}/product/primary/{{productType:string}}?subproducts={{hasSubproducts:boolean}}",
      default:
        "[POST] {{api_v2}}/product/default/{{productType:string}}?subproducts={{hasSubproducts:boolean}}",
    },
  },
};

module.exports = { schema };
