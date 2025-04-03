/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

const serverConfig = require('../serverConfig.js');

// request header for tenant&unit name i case using 'operatorUrlFormat'
exports.header = {
  tenant: 'x-instana-tenant',
  unit: 'x-instana-unit'
};

exports.isDefaultUrlFormat = function isDefaultUrlFormat() {
  return !serverConfig.urlFormatPathStyle;
};

/**
 * Path function to make sure we prefix the give path with TU specifc segments
 * in case the TU uses path strategy to resolve TU information.
 *
 * Note: It's currently only used when defining the CSRF token route on
 * node-server.
 * Question: Do we have to use the operator header in order to get the TU info?
 **/
exports.prefixPathWithTuSegments = path => {
  if (exports.isDefaultUrlFormat()) return path;

  const { tenant, tenantUnit } = serverConfig.clientConfig;

  return `/${tenant}/${tenantUnit}${path}`;
};
