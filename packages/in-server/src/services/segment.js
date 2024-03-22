/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const serverConfig = require('../serverConfig');

exports.getSegmentKey = function getSegmentKey() {
  return serverConfig.segmentKey;
};
