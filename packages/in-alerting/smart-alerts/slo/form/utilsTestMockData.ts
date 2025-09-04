/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ServiceLevelObjectiveConfiguration } from '@instana/types';

export const mockSlo1: ServiceLevelObjectiveConfiguration = {
  id: 'SLOF2PWrKRWSkior3A39fRbBQ',
  name: 'TestSlo1',
  target: 0.99,
  createdDate: 1719405101217,
  lastUpdated: 1719405101127,
  entity: {
    type: 'application',
    applicationId: 'acfRC1IqTVi41OMLAJU4Cw',
    serviceId: undefined,
    endpointId: undefined,
    boundaryScope: 'ALL',
    includeInternal: false,
    includeSynthetic: false,
    tagFilterExpression: {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: []
    }
  },
  indicator: {
    type: 'eventBased',
    threshold: 75,
    aggregation: undefined,
    blueprint: 'latency'
  },
  timeWindow: {
    type: 'fixed',
    duration: 2,
    durationUnit: 'week',
    startTimestamp: 1719340200000,
    timezone: ''
  },
  tags: []
};

export const mockSlo2: ServiceLevelObjectiveConfiguration = {
  id: 'SLO3NvqYLo7Sm27Ru0_PPhqiA',
  name: 'TestSlo2',
  target: 0.5,
  createdDate: 1718194940795,
  lastUpdated: 1718195121719,
  entity: {
    type: 'application',
    applicationId: 'Fwx93plkTtKv09MHqT5d6Q',
    serviceId: undefined,
    endpointId: undefined,
    boundaryScope: 'ALL',
    includeInternal: false,
    includeSynthetic: false,
    tagFilterExpression: {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: []
    }
  },
  indicator: {
    type: 'timeBased',
    threshold: 904,
    aggregation: 'MEAN',
    blueprint: 'latency'
  },
  timeWindow: {
    type: 'fixed',
    duration: 1,
    durationUnit: 'week',
    startTimestamp: 1718143200000,
    timezone: ''
  },
  tags: ['NewTag']
};

export const mockSlo3: ServiceLevelObjectiveConfiguration = {
  id: 'SLOKUgbbDjcT8qjsebUZ_uyjw',
  name: 'TestSlo3',
  target: 0.8,
  createdDate: 1696428573370,
  lastUpdated: 1717768500746,
  entity: {
    type: 'application',
    applicationId: 'acfRC1IqTVi41OMLAJU4Cw',
    serviceId: undefined,
    endpointId: undefined,
    boundaryScope: 'ALL',
    includeInternal: false,
    includeSynthetic: false,
    tagFilterExpression: {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: []
    }
  },
  indicator: {
    type: 'timeBased',
    threshold: 20,
    aggregation: 'MEAN',
    blueprint: 'availability'
  },
  timeWindow: {
    type: 'fixed',
    duration: 1,
    durationUnit: 'day',
    startTimestamp: 1696370400000,
    timezone: ''
  },
  tags: ['test2']
};

export const mockSlo4: ServiceLevelObjectiveConfiguration = {
  id: 'SLOJao7Nmq5Q6S5qLAN4w6S0A',
  name: 'TestSlo4',
  target: 0.75,
  createdDate: 1708590692720,
  lastUpdated: 1718196108928,
  entity: {
    type: 'application',
    applicationId: 'pxJMFR0eQ8m9kvC4MME7sw',
    serviceId: undefined,
    endpointId: undefined,
    boundaryScope: 'ALL',
    includeInternal: false,
    includeSynthetic: false,
    tagFilterExpression: {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: []
    }
  },
  indicator: {
    type: 'eventBased',
    threshold: 50,
    aggregation: undefined,
    blueprint: 'availability'
  },
  timeWindow: {
    type: 'fixed',
    duration: 1,
    durationUnit: 'minute',
    startTimestamp: 1708540200000,
    timezone: ''
  },
  tags: ['AndreiK']
};
