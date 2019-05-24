import React, { Fragment } from 'react';

import { unitColumn } from 'in-internal/monitoringUnit/units/UnitList/analysisModes/common';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { percentage, number } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';

export default {
  name: 'Application',
  initialSortColumn: 1,
  initialSortDirection: 'desc',
  cols: [
    unitColumn,
    {
      id: 'spanDropping',
      title: 'Backend Dropped Spans',
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.id;
        },
        getMetricName() {
          return 'appdata-processor.spanDropping';
        },
        getContent: percentage.detailed,
        getTimeWindowAggregation(row) {
          return row.metricAggregation;
        },
        forceTimeWindowAggregation: true
      }
    },
    {
      id: 'spanDropping',
      title: 'Backend Dropped Spans',
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.id;
        },
        getMetricName() {
          return 'appdata-processor.spanDropping';
        },
        getContent: percentage.detailed,
        getTimeWindowAggregation(row) {
          return row.metricAggregation;
        },
        forceTimeWindowAggregation: true
      }
    },
    {
      id: 'Processed Spans',
      title: 'Processed Spans',
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.id;
        },
        getMetricName() {
          return 'appdata-processor.processedSpans';
        },
        getContent: number.compact,
        getTimeWindowAggregation(row) {
          return row.metricAggregation;
        },
        forceTimeWindowAggregation: true
      }
    },
    {
      id: 'Dropped Spans Due To Configuration',
      title: 'Dropped Spans Due To Configuration',
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.id;
        },
        getMetricName() {
          return 'appdata-processor.droppedSpansDueToConfiguration';
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
      <Fragment>
        <Chart
          snapshotId={id}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            max: 1,
            formatter: percentage.detailed,
            metrics: [`appdata-processor.spanDropping`],
            labels: ['Backend Dropped Spans'],
            type: 'stackedArea'
          }}
        />
        <Columize>
          <Chart
            snapshotId={id}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              metrics: [`appdata-processor.processedSpans`],
              labels: ['Processed Spans'],
              type: 'stackedArea'
            }}
          />
          <Chart
            snapshotId={id}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              metrics: [`appdata-processor.droppedSpansDueToConfiguration`],
              labels: ['Dropped Spans due to Configuration'],
              type: 'stackedArea'
            }}
          />
        </Columize>
      </Fragment>
    );
  }
};
