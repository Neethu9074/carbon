const request = require('request');
const serverConfig = require('../serverConfig.js');

module.exports = function uiBackendHealthCheck() {
  return new Promise((resolve, reject) => {
    request({
      url: serverConfig.uiBackendBaseUrl + '/ping',
      timeout: 5000
    }, (error, response) => {
      if (error) {
        reject(new Error(`Failed to contact ui-backend: ${String(error)}`));
      } else if (response.statusCode === 200) {
        resolve('OK.');
      } else {
        reject(new Error(`UI-Backend responded with status code ${response.statusCode}. Expected 200.`));
      }
    });
  });
};
