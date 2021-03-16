/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const fetch = require('node-fetch');
const { get } = require('lodash');
const https = require('https');
const http = require('http');

const httpClientConfig = require('../serverConfig.js').httpClient;

// See https://nodejs.org/api/http.html#http_new_agent_options
const keepAliveMsecs = get(httpClientConfig, ['keepAliveMillis'], 30000);
const agentConfig = {
  keepAlive: keepAliveMsecs > 0,
  keepAliveMsecs,
  scheduling: 'lifo',
  maxSockets: get(httpClientConfig, ['maxConnectionsPerRoute'], 1024),
  maxTotalSockets: get(httpClientConfig, ['maxConnections'], 2048),
  timeout: get(httpClientConfig, ['timeoutMillis'], 5000)
};
const httpAgent = new http.Agent(agentConfig);
const httpsAgent = new https.Agent(agentConfig);

const defaultNodeFetchOptions = {
  follow: 5,
  agent: url => (url.protocol === 'http:' ? httpAgent : httpsAgent),
  headers: {
    'User-Agent': get(httpClientConfig, ['userAgent'], 'ui-client')
  }
};

module.exports = exports = function fetchWithDefaultOptions(path, options) {
  if (options) {
    let headers = defaultNodeFetchOptions.headers;
    if (options.headers) {
      headers = {
        ...headers,
        ...options.headers
      };
    }
    options = {
      ...defaultNodeFetchOptions,
      ...options,
      headers
    };
  } else {
    options = defaultNodeFetchOptions;
  }

  return fetch(path, options);
};
