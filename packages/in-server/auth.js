const sendRequest = require('request');

const serverConfig = require('./serverConfig.js');

exports.getCurrentUser = req => {
  const cookieValue = req.cookies[serverConfig.cookie.name];
  if (cookieValue == null || typeof cookieValue !== 'string' || cookieValue.trim().length < 5) {
    return Promise.resolve([401, null]);
  }

  return new Promise((resolve, reject) => {
    sendRequest({
      url: req.uiBackendBaseUrl + '/checkUserAccessPermitted',
      headers: {
        'Cookie': `${serverConfig.cookie.name}=${cookieValue}`
      },
      timeout: 15000
    }, (error, response, userStr) => {
      if (error) {
        reject(new Error('Failed to retrieve current user from ui-backend: ' + String(error)));
      } else {
        resolve([response.statusCode, userStr]);
      }
    });
  });
};
