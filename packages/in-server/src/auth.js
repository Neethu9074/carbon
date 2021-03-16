/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const config = require('./serverConfig.js');
const fetch = require('./services/fetch');

exports.getCurrentUser = async req => {
  if (!exports.isRequestCarryingAValidSeemingCookie(req)) {
    return [401, null];
  }

  const cookieValue = req.cookies && req.cookies[config.cookie.name];
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

exports.isRequestCarryingAValidSeemingCookie = req => {
  const cookieValue = req.cookies && req.cookies[config.cookie.name];
  return typeof cookieValue === 'string' && cookieValue.trim().length > 5;
};
