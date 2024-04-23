/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { User } from 'in-types';

const serverConfig = require('../serverConfig.js');

exports.getOrbitalSpaceID = function getOrbitalSpaceID(user: User, testingGroup: boolean): string | undefined {
  if (!user || !user.id || !testingGroup) return undefined;

  return serverConfig.orbitalSpaceID as string;
};
