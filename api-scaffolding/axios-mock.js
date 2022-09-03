const axios = {
  get: (url, config) =>
    Promise.resolve(`GET[${url}] config: ${JSON.stringify(config)}`),
  delete: (url, config) =>
    Promise.resolve(`DELETE[${url}] config: ${JSON.stringify(config)}`),
  post: (url, payload, config) =>
    Promise.resolve(
      `POST[${url}] payload: ${JSON.stringify(
        payload
      )} config: ${JSON.stringify(config)}`
    ),
  put: (url, payload, config) =>
    Promise.resolve(
      `PUT[${url}] payload: ${JSON.stringify(
        payload
      )}  config: ${JSON.stringify(config)}`
    ),
  patch: (url, payload, config) =>
    Promise.resolve(
      `PATCH[${url}] payload: ${JSON.stringify(
        payload
      )} config: ${JSON.stringify(config)}`
    ),
};

module.exports = { axios };
