/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  GenericInfraAlertRule,
  InfraAlertConfig,
  InfraAlertConfigWithMetadata,
  StaticThresholdConfig
} from '@instana/types';

import { defaultTimeWindow } from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/form';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';

export interface InfraAlertConfigWithID extends InfraAlertConfig {
  readonly id?: string;
}

export default function generateAlertConfig(): InfraAlertConfigWithMetadata {
  const rule: GenericInfraAlertRule = {
    alertType: 'genericRule',
    aggregation: 'MEAN',
    crossSeriesAggregation: 'MEAN',
    entityType: '',
    metricName: ''
  };

  const threshold: StaticThresholdConfig = {
    type: STATIC_THRESHOLD,
    lastUpdated: 0,
    operator: '>='
  } as StaticThresholdConfig;

  return {
    alertChannelIds: [],
    description: '',
    groupBy: [],
    name: '',
    rule,
    severity: 5,

    //@ts-expect-error type-conflict: created would be a timestamp if created on the server.
    created: undefined,
    threshold,
    timeThreshold: {
      type: 'violationsInSequence',
      timeWindow: defaultTimeWindow
    }
  };
}
