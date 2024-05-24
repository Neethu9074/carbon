/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

const serverConfig = require('../serverConfig.js');

exports.getOrbitalSpaceID = function getOrbitalSpaceID(user, testingGroup) {
  if (!user || !user.id || !testingGroup) return undefined;

  return serverConfig.orbitalSpaceID;
};
