/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

export function generateQueryWithWinSize(windowSize: number): any {
  const currentTimestamp = Date.now();
  const query = {
    subscriptionId: 44,
    metrics: {
      'y1-0': {
        source: 'LOG',
        metric: 'log_volume',
        aggregation: 'SUM',
        timeShift: {
          offset: 0
        },
        compareToTimeShifted: false,
        label: '',
        metricLabel: 'Calls',
        color: '',
        tagFilterExpression: {
          type: 'EXPRESSION',
          logicalOperator: 'AND',
          elements: []
        },
        includeInternal: false,
        includeSynthetic: false,
        grouping: [
          {
            by: {
              groupbyTag: 'retention_days',
              groupbyTagSecondLevelKey: ''
            },
            direction: 'DESC',
            includeOthers: false,
            maxResults: 5
          }
        ],
        granularity: 600000,
        resultType: 'SINGLE_NUMBER',
        timeConfig: {
          to: currentTimestamp,
          windowSize: windowSize + 30 * 86400000,
          focusedMoment: currentTimestamp,
          autoRefresh: false
        }
      }
    }
  };
  return query;
}
