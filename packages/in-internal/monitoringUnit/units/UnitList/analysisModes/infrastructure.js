/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import { unitColumn } from 'in-internal/monitoringUnit/units/UnitList/analysisModes/common';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { percentage, number } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';

export default {
  name: 'Infrastructure',
  initialSortColumn: 1,
  initialSortDirection: 'desc',
  cols: [
    unitColumn,
    {
      id: 'Number of Entities',
      title: 'Number of Entities',
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.id;
        },
        getMetricName() {
          return 'filler.numberOfEntities';
        },
        getContent: number.compact,
        getTimeWindowAggregation(row) {
          return row.metricAggregation;
        },
        forceTimeWindowAggregation: true
      }
    },
    {
      id: 'Entity Usage',
      title: 'Entity Usage',
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.id;
        },
        getMetricName() {
          return 'filler.entityUsage';
        },
        getContent: percentage.detailed,
        getTimeWindowAggregation(row) {
          return row.metricAggregation;
        },
        forceTimeWindowAggregation: true
      }
    },
    {
      id: 'Raw Message Drop Rate',
      title: 'Raw Message Drop Rate',
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.id;
        },
        getMetricName() {
          return 'filler.rawMessageDropRate';
        },
        getContent: percentage.detailed,
        getTimeWindowAggregation(row) {
          return row.metricAggregation;
        },
        forceTimeWindowAggregation: true
      }
    },
    {
      id: 'Entity Message Drop Rate',
      title: 'Entity Message Drop Rate',
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.id;
        },
        getMetricName() {
          return 'filler.rawEntityDropRate';
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
      <Fragment>
        <Columize>
          <Chart
            snapshotId={id}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              metrics: [`filler.numberOfEntities`],
              labels: ['Number of Entities'],
              type: 'stackedArea'
            }}
          />
          <Chart
            snapshotId={id}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              max: 1,
              formatter: percentage.detailed,
              metrics: [`filler.entityUsage`],
              labels: ['Entity Usage'],
              type: 'stackedArea'
            }}
          />
        </Columize>

        <Columize>
          <Chart
            snapshotId={id}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              max: 1,
              formatter: percentage.compact,
              metrics: [`filler.rawMessageDropRate`],
              labels: ['Raw Message Drop Rate (group of entity messages)'],
              type: 'stackedArea'
            }}
          />

          <Chart
            snapshotId={id}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              max: 1,
              formatter: percentage.compact,
              metrics: [`filler.rawEntityDropRate`],
              labels: ['Entity Message Drop Rate'],
              type: 'stackedArea'
            }}
          />
        </Columize>
      </Fragment>
    );
  }
};
