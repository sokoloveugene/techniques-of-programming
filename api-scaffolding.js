const axios = {
  get: (url) => console.log("AXIOS get on ", url),
  delete: (url) => console.log("AXIOS delete on ", url),
  post: (url, data) => console.log("AXIOS post on ", url, " with ", data),
  put: (url, data) => console.log("AXIOS put on ", url, " with ", data),
  patch: (url, data) => console.log("AXIOS patch on ", url, " with ", data),
};

const methods = {
  "[GET]": "get",
  "[DELETE]": "delete",
  "[POST]": "post",
  "[PUT]": "put",
  "[PATCH]": "patch",
};

const domains = {
  api_v2: "http://localhost:8000",
  api_v1: "http://localhost:4200/api",
};

const regex = {
  param: /{{(.*?)}}/g,
};

class ApiBuilder {
  constructor(config) {
    this.api = {};
    this.buildApi(config);
    return this.api;
  }

  buildApi(config, reference = this.api) {
    const pairs = Object.entries(config);

    for (const [key, value] of pairs) {
      const isGroup = typeof value === "object";

      if (isGroup) {
        reference[key] = {};
        this.buildApi(value, reference[key]);
      } else {
        reference[key] = this.createHandler(value);
      }
    }
  }

  createHandler(template) {
    return async (params = {}) => {
      const { httpMethod, url, payload } = this.preprocess(template, params);
      return axios[httpMethod](url, payload);
    };
  }

  preprocess(template, parameters = {}) {
    const [method, url] = template.split(" ");

    return {
      httpMethod: methods[method],
      url: url.replace(
        regex.param,
        (match, $1) => parameters[$1] ?? domains[$1]
      ),
      payload: parameters.payload,
    };
  }
}

const config = {
  heartbeat: "[GET] {{api_v1}}/heartbeat",
  client: {
    get: "[GET] {{api_v1}}/customer/{{id}}",
    update: "[POST] {{api_v2}}/customer/{{id}}?primary={{isPrimary}}",
  },
  product: {
    delete: "[DELETE] {{api_v1}}/product/{{productId}}/{{productType}}",
    add: {
      primary:
        "[POST] {{api_v2}}/product/primary/{{productType}}?subproducts={{hasSubproducts}}",
      default:
        "[POST] {{api_v2}}/product/default/{{productType}}?subproducts={{hasSubproducts}}",
    },
  },
};

const api = new ApiBuilder(config);

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

// AXIOS delete on  http://localhost:4200/api/product/_a#d10/pants
api.product.delete({
  productId: "_a#d10",
  productType: "pants",
});
