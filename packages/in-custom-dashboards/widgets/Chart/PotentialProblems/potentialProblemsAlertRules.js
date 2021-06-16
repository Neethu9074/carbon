/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export const throughputHighAlertRule = {
  throughputHigh: {
    rule: {
      alertType: 'throughput',
      aggregation: 'SUM',
      metricName: 'calls'
    },
    seasonality: 'DAILY',
    operator: '>='
  }
};

export const throughputLowAlertRule = {
  throughputLow: {
    rule: {
      alertType: 'throughput',
      aggregation: 'SUM',
      metricName: 'calls'
    },
    seasonality: 'DAILY',
    operator: '<='
  }
};

export function getLatencyAlertRule(aggregation) {
  return {
    slowness: {
      rule: {
        alertType: 'slowness',
        aggregation,
        metricName: 'latency'
      },
      seasonality: 'DAILY'
    }
  };
}

export const errorRateAlertRule = {
  errorRate: {
    rule: {
      alertType: 'errorRate',
      aggregation: 'MEAN',
      metricName: 'errors'
    }
  }
};
