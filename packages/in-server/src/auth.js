const fetch = require('node-fetch');

const config = require('./serverConfig.js');

exports.getCurrentUser = async req => {
  const cookieValue = req.cookies && req.cookies[config.cookie.name];
  if (cookieValue == null || typeof cookieValue !== 'string' || cookieValue.trim().length < 5) {
    return [401, null];
  }

  const response = await fetch(req.uiBackendBaseUrl + '/api/checkUserAccessPermitted', {
    headers: {
      Cookie: `${config.cookie.name}=${cookieValue}`
    },
    timeout: 15000
  });

  let userStr;
  if (response.ok) {
    userStr = await response.text();
  }

  return [response.status, userStr];
};
