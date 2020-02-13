const sendRequest = require('request');

const configResolver = require('../services/config');
const serverConfig = require('../serverConfig.js');

exports.getCsrfToken = function getCsrfToken(req) {
  return configResolver.getButlerBaseUrl(req.tenant, req.unit).then(butlerBaseUrl => {
    return new Promise((resolve, reject) => {
      sendRequest(
        {
          url: `${butlerBaseUrl}/tos-privacy-agreement/csrf/token`,
          headers: {
            Cookie: `${serverConfig.cookie.name}=${req.cookies[serverConfig.cookie.name]}`
          },
          timeout: 15000
        },
        (error, response) => {
          if (error) {
            reject(new Error('Failed to retrieve csrf token from butler: ' + String(error)));
          } else {
            resolve(response.headers['x-csrf-token']);
          }
        }
      );
    });
  });
};
