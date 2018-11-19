const sendRequest = require('request');

const serverConfig = require('./serverConfig.js');

exports.getCurrentUser = req => {
  const cookieValue = req.cookies[serverConfig.cookie.name];
  if (cookieValue == null) {
    return Promise.resolve([401, null]);
  }

  return new Promise((resolve, reject) => {
    sendRequest({
      url: serverConfig.uiBackendBaseUrl + '/checkUserAccessPermitted',
      headers: {
        'Cookie': `${serverConfig.cookie.name}=${cookieValue}`
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
