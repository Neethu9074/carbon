/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { getDropwizardWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

const cols = [
  {
    title: t('in-internal:monitoringUnit.infrastructureMetrics.filler.customer'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.container.get('label');
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.infrastructureMetrics.filler.dropKafkaMetricWrite'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.dropwizard.get('id');
      },
      getMetricName() {
        return `metrics.meters.com.instana.filler.topology.FilledMetricsDownstreamInitializer.dropped-metrics-kafka`;
      },
      getContent: number.compact,
      forceTimeWindowAggregation: true,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.infrastructureMetrics.filler.numMetrics'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.dropwizard.get('id');
      },
      getMetricName() {
        return `metrics.meters.com.instana.filler.service.processingStatistics.ProcessingStatistics.metrics`;
      },
      getContent: number.compact,
      forceTimeWindowAggregation: true,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo({
  timeConfig: timeConfig$,
  rows: getDropwizardWithContext('entity.jvm.app.name:filler')
})(function AppDataProcessorStatistics({ rows }) {
  if (rows.length === 0) {
    return <LoadingIndicator />;
  }

  return (
    <Table
      cardTitle={t('in-internal:monitoringUnit.infrastructureMetrics.filler.fillersRowLen', {
        rowslength: rows.length
      })}
      cols={cols}
      rows={rows}
      maxItemsPerPage={200}
      getRowDetails={getRowDetails}
    />
  );
});

function getRowDetails(row) {
  return (
    <>
      <Chart
        snapshotId={row.dropwizard.get('id')}
        timeConfig={row.timeConfig}
        minRollup={5000}
        y1={{
          min: 0,
          formatter: number.detailed,
          metrics: [
            `metrics.meters.com.instana.filler.topology.FilledMetricsDownstreamInitializer.dropped-metrics-kafka`
          ],
          labels: [t('in-internal:monitoringUnit.infrastructureMetrics.filler.dropKafkaMetricWrite')],
          type: 'stackedArea'
        }}
      />
      <Chart
        snapshotId={row.dropwizard.get('id')}
        timeConfig={row.timeConfig}
        minRollup={5000}
        y1={{
          min: 0,
          formatter: number.detailed,
          metrics: [`metrics.meters.com.instana.filler.service.processingStatistics.ProcessingStatistics.metrics`],
          labels: [t('in-internal:monitoringUnit.infrastructureMetrics.filler.numMetrics')],
          type: 'stackedArea'
        }}
      />
    </>
  );
}
