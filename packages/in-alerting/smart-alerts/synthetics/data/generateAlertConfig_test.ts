/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import generateAlertConfig from 'in-alerting/smart-alerts/synthetics/data/generateAlertConfig';

describe('generateAlertConfig', () => {
  it('should return the default alert config when no testIds are provided', () => {
    const result = generateAlertConfig();
    expect(result).toEqual({
      enabled: true,
      readOnly: false,
      created: undefined,
      description: '',
      name: '',
      severity: 5,
      rule: {
        alertType: 'failure',
        metricName: 'status'
      },
      alertChannelIds: [],
      syntheticTestIds: [],
      timeThreshold: {
        type: 'violationsInSequence',
        violationsCount: 1
      }
    });
  });

  it('should include provided testIds in the syntheticTestIds field', () => {
    const testIds = ['test1', 'test2'];
    const result = generateAlertConfig(testIds);
    expect(result.syntheticTestIds).toEqual(testIds);
  });
});
