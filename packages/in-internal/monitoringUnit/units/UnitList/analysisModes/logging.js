/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { unitColumn } from 'in-internal/monitoringUnit/units/UnitList/analysisModes/common';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default {
  name: 'Logging',
  initialSortColumn: 1,
  initialSortDirection: 'desc',
  cols: [
    unitColumn,
    {
      id: 'logByteRateLimitAccepted',
      title: t('in-internal:monitoringUnit.units.logging.logByteRateLimitAccepted'),
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.id;
        },
        getMetricName() {
          return `acceptor.logByteRateLimitAccepted`;
        },
        getContent: bytesTwoDecimalPlaces,
        getTimeWindowAggregation(row) {
          return row.metricAggregation;
        },
        forceTimeWindowAggregation: true
      }
    },
    {
      id: 'logByteRateLimitDropped',
      title: t('in-internal:monitoringUnit.units.logging.logByteRateLimitDropped'),
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.id;
        },
        getMetricName() {
          return `acceptor.logByteRateLimitDropped`;
        },
        getContent: bytesTwoDecimalPlaces,
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
          formatter: bytesTwoDecimalPlaces,
          metrics: [`acceptor.logByteRateLimitAccepted`, `acceptor.logByteRateLimitDropped`],
          labels: [
            t('in-internal:monitoringUnit.units.logging.logByteRateLimitAccepted'),
            t('in-internal:monitoringUnit.units.logging.logByteRateLimitDropped')
          ],
          type: 'stackedArea'
        }}
      />
    );
  }
};
