/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { TimeConfig } from 'in-types';

const getHealthInfoQueryParams = (entityType: string, nodeId: string, timeConfig: TimeConfig) => {
  let finalParams: {
    applicationId: string | undefined;
    serviceId: string | undefined;
    endpointId?: string | undefined;
    timeConfig: TimeConfig;
  } = {
    applicationId: undefined,
    serviceId: undefined,
    endpointId: undefined,
    timeConfig
  };

  if (entityType === 'application') {
    finalParams['applicationId'] = nodeId;
  } else if (entityType === 'service') {
    finalParams['serviceId'] = nodeId;
  } else if (entityType === 'endpoint') {
    finalParams['endpointId'] = nodeId;
  }

  return finalParams;
};

export default getHealthInfoQueryParams;
