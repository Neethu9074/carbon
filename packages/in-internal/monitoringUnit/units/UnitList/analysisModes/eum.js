/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { unitColumn } from 'in-internal/monitoringUnit/units/UnitList/analysisModes/common';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number } from 'in-services/formatters/number';

export default {
  name: 'End-User Monitoring',
  initialSortColumn: 1,
  initialSortDirection: 'desc',
  cols: [
    unitColumn,
    {
      id: 'website-beacons',
      title: 'Website Beacons',
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.id;
        },
        getMetricName() {
          return `eum-acceptor.websiteBeacons`;
        },
        getContent: number.compact,
        getTimeWindowAggregation(row) {
          return row.metricAggregation;
        },
        forceTimeWindowAggregation: true
      }
    },
    {
      id: 'mobile-beacons',
      title: 'Mobile App Beacons',
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.id;
        },
        getMetricName() {
          return `eum-acceptor.mobileAppBeacons`;
        },
        getContent: number.compact,
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
          formatter: number.compact,
          metrics: [`eum-acceptor.websiteBeacons`, `eum-acceptor.mobileAppBeacons`],
          labels: ['Website Beacons', 'Mobile App Beacons'],
          type: 'stackedArea'
        }}
      />
    );
  }
};
