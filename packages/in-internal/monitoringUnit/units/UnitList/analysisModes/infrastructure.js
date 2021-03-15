/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { unitColumn } from 'in-internal/monitoringUnit/units/UnitList/analysisModes/common';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { percentage, number } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { t } from 'in-i18n';

export default {
  name: 'Infrastructure',
  initialSortColumn: 1,
  initialSortDirection: 'desc',
  cols: [
    unitColumn,
    {
      id: 'Number of Entities',
      title: t('in-internal:monitoringUnit.units.infrastructure.numEntities'),
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
      title: t('in-internal:monitoringUnit.units.infrastructure.entityUsage'),
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
      title: t('in-internal:monitoringUnit.units.infrastructure.rawMzgDropRate'),
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
      title: t('in-internal:monitoringUnit.units.infrastructure.entityMsgDropRate'),
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
              labels: [t('in-internal:monitoringUnit.units.infrastructure.numEntities')],
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
              labels: [t('in-internal:monitoringUnit.units.infrastructure.entityUsage')],
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
              labels: [t('in-internal:monitoringUnit.units.infrastructure.rawMsgDropRateGroupEntityMsg')],
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
              labels: [t('in-internal:monitoringUnit.units.infrastructure.entityMsgDropRate')],
              type: 'stackedArea'
            }}
          />
        </Columize>
      </Fragment>
    );
  }
};
