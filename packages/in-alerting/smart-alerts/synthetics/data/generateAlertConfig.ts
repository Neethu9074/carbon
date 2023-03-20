/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  FailureSyntheticAlertRule,
  SyntheticAlertConfig,
  SyntheticAlertConfigWithMetadata,
  TagFilter
} from '@instana/types';

export interface SyntheticAlertConfigWithID extends SyntheticAlertConfig {
  readonly id?: string;
}

export default function generateAlertConfig(testIds?: string[]): SyntheticAlertConfigWithMetadata {
  const rule: FailureSyntheticAlertRule = {
    alertType: 'failure',
    metricName: 'status'
  };

  const tagFilterExpression: TagFilter = {
    entity: 'NOT_APPLICABLE',
    name: 'synthetic.locationId',
    type: 'TAG_FILTER',
    value: '',
    operator: 'EQUALS'
  };

  return {
    enabled: true,
    readOnly: false,
    id: '123',
    //@ts-expect-error type-conflict: created would be a timestamp if created on the server.
    created: undefined,
    description: 'new config description',
    name: 'new config',
    severity: 5,
    rule,
    alertChannelIds: [],
    syntheticTestIds: testIds ?? [],
    tagFilterExpression,
    timeThreshold: {
      type: 'violationsInSequence',
      violationsCount: 1
    }
  };
}
