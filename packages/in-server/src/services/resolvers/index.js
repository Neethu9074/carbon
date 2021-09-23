/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const serverConfig = require('../../serverConfig.js');
const { logger } = require('../../logging');

if (serverConfig.instanactlCockroachDb && serverConfig.instanactlCockroachDb.host) {
  startWith('instanactl');
} else if (serverConfig.resolver === 'operator') {
  startWith('operator');
} else {
  startWith('config');
}

function startWith(name) {
  logger.info(`Starting ui-client with ${name} based configuration and service resolver.`);
  exports.activeResolver = require(`./${name}`);
}
