const sendRequest = require('request');

const serverConfig = require('./serverConfig.js');

exports.getCurrentUser = req => {
  return new Promise((resolve, reject) => {
    sendRequest({
      url: serverConfig.uiBackendBaseUrl + '/checkUserAccessPermitted',
      headers: {
        'Cookie': `${serverConfig.cookie.name}=${req.cookies[serverConfig.cookie.name]}`
      },
      timeout: 5000
    }, (error, response, userStr) => {
      if (error) {
        reject(new Error('Failed to retrieve current user from ui-backend: ' + String(error)));
      } else {
        resolve([response.statusCode, userStr]);
      }
    });
  });
};
