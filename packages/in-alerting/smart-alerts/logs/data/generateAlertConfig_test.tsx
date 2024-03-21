/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { defaultTimeWindow } from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/form';
import generateAlertConfig from 'in-alerting/smart-alerts/logs/data/generateAlertConfig';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';

describe('in-alerting/smart-alerts/logs/data/generateAlertConfig', () => {
  it('returns a valid LogAlertConfig', () => {
    const alertConfig = generateAlertConfig();

    expect(alertConfig).toEqual({
      alertChannelIds: [],
      description: '',
      groupBy: [],
      name: '',
      severity: 5,
      created: undefined,
      threshold: {
        type: STATIC_THRESHOLD,
        lastUpdated: 0,
        operator: '>='
      },
      timeThreshold: {
        type: 'violationsInSequence',
        timeWindow: defaultTimeWindow
      }
    });
  });
});
