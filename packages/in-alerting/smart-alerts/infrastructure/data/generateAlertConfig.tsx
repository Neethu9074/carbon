/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { GenericInfraAlertRule, InfraAlertConfig, InfraAlertConfigWithMetadata } from '@instana/types';

export interface InfraAlertConfigWithID extends InfraAlertConfig {
  readonly id?: string;
}

export default function generateAlertConfig(): InfraAlertConfigWithMetadata {
  const rule: GenericInfraAlertRule = {
    alertType: 'genericRule',
    aggregation: 'SUM',
    crossSeriesAggregation: 'SUM',
    entityType: '',
    metricName: ''
  };

  return {
    alertChannelIds: [],
    description: '',
    groupBy: [],
    name: '',
    rule,
    severity: 5,

    //@ts-expect-error type-conflict: created would be a timestamp if created on the server.
    created: undefined,
    timeThreshold: {
      type: 'violationsInSequence',
      timeWindow: 1
    }
  };
}
