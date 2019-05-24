import React from 'react';

import { unitColumn } from 'in-internal/monitoringUnit/units/UnitList/analysisModes/common';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { percentage } from 'in-services/formatters/number';

export default {
  name: 'API Usage',
  initialSortColumn: 1,
  initialSortDirection: 'desc',
  cols: [
    unitColumn,
    {
      id: 'API Call Block (Rate Limiting) Rate',
      title: 'API Call Block (Rate Limiting) Rate',
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.id;
        },
        getMetricName() {
          return 'ui-backend.apiRateLimiting';
        },
        getContent: percentage.detailed,
        getTimeWindowAggregation(row) {
          return row.metricAggregation;
        },
        forceTimeWindowAggregation: true
      }
    }
  ],
  getRowDetails({ timeConfig, id }) {
    return (
      <Chart
        snapshotId={id}
        timeConfig={timeConfig}
        y1={{
          min: 0,
          max: 1,
          formatter: percentage.detailed,
          metrics: [`ui-backend.apiRateLimiting`],
          labels: ['API Call Block (Rate Limiting) Rate'],
          type: 'stackedArea'
        }}
      />
    );
  }
};
