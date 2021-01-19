/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
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
    title: 'Customer',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.container.get('label');
      }
    }
  },
  {
    title: 'Dropped Kafka Metric Writes',
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
    title: '#Metrics',
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
      cardTitle={`Fillers (${rows.length})`}
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
          labels: ['Dropped Kafka Metric Writes'],
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
          labels: ['#Metrics'],
          type: 'stackedArea'
        }}
      />
    </>
  );
}
