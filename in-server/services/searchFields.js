const sendRequest = require('request');

const serverConfig = require('../serverConfig.js');

exports.searchFields = [];
exports.searchFieldsStr = '[]';

getSearchFields();
setInterval(getSearchFields, 1000 * 60);

function getSearchFields() {
  sendRequest({
    url: serverConfig.uiBackendBaseUrl + '/api/search/fields',
    timeout: 5000
  }, (error, response, body) => {
    if (error) {
      console.error('Failed to retrieve searchFields from ui-backend:', error);
    } else {
      exports.searchFieldsStr = body;
      exports.searchFields = JSON.parse(body);
    }
  });
}
