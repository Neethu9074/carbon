/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const someFormData = {
  id: '<generated server side',
  name: 'JS Specific errors example',
  description: 'Foobar',
  severity: 5,
  triggering: false,

  tagFilters: [
    {
      name: 'beacon.website.name',
      operator: 'EQUALS',
      stringValue: 'Shop'
    },
    {
      name: 'beacon.page.name',
      operator: 'EQUALS',
      stringValue: 'Homepage'
    }
  ],
  rule: {
    matchingOperator: 'CONTAINS',
    value: 'unknown error'
  },
  baseline: {
    to: 0,
    windowSize: 0,
    seasonality: 'DAILY',
    granularity: 0,
    segments: [],
    sdFactor: 1.0
  },
  alertChannelIds: [],
  enabled: true
};

export function someLogsFormData() {
  return {
    ...someFormData,
    rule: {
      ...someFormData.rule,
      alertType: 'logs',
      message: 'dummy message'
    },
    threshold: {
      operator: '>',
      value: 150
    }
  };
}
export function someErrorRateFormData() {
  return {
    ...someFormData,
    rule: {
      ...someFormData.rule,
      metricName: 'calls',
      alertType: 'errorRate'
    },
    threshold: {
      type: 'staticThreshold',
      value: 100
    }
  };
}

export const someSlownessFormData = {
  ...someFormData,
  rule: {
    ...someFormData.rule,
    alertType: 'slowness'
  },
  threshold: {
    type: 'historicBaseline',
    operator: '>=',
    lastUpdated: 1589797200000,
    seasonality: 'DAILY',
    baseline: [
      [0, 65.5742, 9.4923],
      [600000, 64.6961, 9.8364],
      [1200000, 63.9258, 10.4111],
      [1800000, 62.0062, 10.7485],
      [2400000, 62.5975, 11.2608],
      [3000000, 62.2398, 11.6442],
      [3600000, 61.7068, 11.7431],
      [4200000, 61.3718, 11.9457],
      [4800000, 60.9572, 11.8491],
      [5400000, 59.6989, 11.6518],
      [6000000, 60.926, 11.5923],
      [6600000, 61.2488, 11.4861],
      [7200000, 61.7577, 11.0635]
    ],
    deviationFactor: 4
  }
};
