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

module.exports = { axios };
