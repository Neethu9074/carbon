/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  ChangeSummary,
  SyntheticAlertConfigWithMetadata,
  SyntheticAlertRuleUnion,
  TagFilterExpressionElementUnion
} from '@instana/types';

import AlertConfiguration from 'in-alerting/smart-alerts/synthetics/details/AlertConfiguration';

export default { component: AlertConfiguration };
const rule: SyntheticAlertRuleUnion = {
  aggregation: 'SUM',
  alertType: 'failure',
  metricName: 'status'
};
const tagFilterExpression: TagFilterExpressionElementUnion = {
  entity: 'NOT_APPLICABLE',
  name: 'synthetic.locationId',
  type: 'TAG_FILTER',
  value: '',
  operator: 'EQUALS'
};

const changeSummary: ChangeSummary = {
  changeType: 'DELETE',
  author: {
    id: '123',
    type: 'USER'
  }
};

const alertConfig: SyntheticAlertConfigWithMetadata & ChangeSummary = {
  enabled: true,
  readOnly: false,
  id: '123',
  created: 123,
  description: 'new config description',
  name: 'new config',
  severity: 5,
  rule,
  alertChannelIds: [],
  syntheticTestIds: [],
  tagFilterExpression,
  timeThreshold: {
    type: 'violationsInSequence',
    violationsCount: 1
  },
  //@ts-expect-error - as changeSummary is not avaliable in all cases
  changeSummary
};

export const Default = {
  args: {
    alertConfig
  }
};
