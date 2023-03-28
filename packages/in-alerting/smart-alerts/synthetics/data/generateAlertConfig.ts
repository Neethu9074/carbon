/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { FailureSyntheticAlertRule, SyntheticAlertConfig, SyntheticAlertConfigWithMetadata } from '@instana/types';

export interface SyntheticAlertConfigWithID extends SyntheticAlertConfig {
  readonly id?: string;
}

export default function generateAlertConfig(testIds?: string[]): SyntheticAlertConfigWithMetadata {
  const rule: FailureSyntheticAlertRule = {
    alertType: 'failure',
    metricName: 'status'
  };

  return {
    enabled: true,
    readOnly: false,
    //@ts-expect-error type-conflict: created would be a timestamp if created on the server.
    created: undefined,
    description: '',
    name: '',
    severity: 5,
    rule,
    alertChannelIds: [],
    syntheticTestIds: testIds ?? [],
    timeThreshold: {
      type: 'violationsInSequence',
      violationsCount: 1
    }
  };
}
