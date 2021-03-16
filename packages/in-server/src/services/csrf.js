/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const UnauthorizedError = require('../errors/UnauthorizedError.js');
const serverConfig = require('../serverConfig.js');
const configResolver = require('./config');
const fetch = require('./fetch');

exports.getCsrfToken = async function getCsrfToken(req) {
  try {
    const butlerBaseUrl = await configResolver.getButlerBaseUrl(req.tenant, req.unit);
    const response = await fetch(`${butlerBaseUrl}/tos-privacy-agreement/csrf/token`, {
      headers: {
        Cookie: `${serverConfig.cookie.name}=${req.cookies[serverConfig.cookie.name]}`
      }
    });
    if (!response.ok) {
      if (response.status === 401) {
        throw new UnauthorizedError(`Retrieved status code ${response.status} while receiving CSRF token.`);
      }
      throw new Error(`Retrieved status code ${response.status} while receiving CSRF token.`);
    }
    return response.headers.get('x-csrf-token');
  } catch (e) {
    if (e instanceof UnauthorizedError) {
      throw e;
    }
    throw new Error('Failed to retrieve csrf token from butler: ' + String(e));
  }
};
