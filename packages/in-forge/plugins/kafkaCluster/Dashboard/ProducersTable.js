/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { bytesPerSecondTwoDecimalPlaces, millis } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.kafkaCluster.jvm'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      }
    }
  },
  {
    title: t('in-forge:plugins.kafkaCluster.id'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: t('in-forge:plugins.kafkaCluster.byteRate'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `kafkaClient.producer.${row.producerId}.producerOutgoingByteRate`;
      },
      getContent: bytesPerSecondTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.kafkaCluster.throttling'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `kafkaClient.producer.${row.producerId}.produceThrottleTime`;
      },
      getContent: millis.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.kafkaCluster.latency'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `kafkaClient.producer.${row.producerId}.produceRequestLatency`;
      },
      getContent: millis.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ProducersTable({ clientSnapshots, timeConfig }) {
  if (!clientSnapshots) {
    return null;
  }

  let rows = [];

  clientSnapshots.forEach(jvmSnapshot => {
    const ids = jvmSnapshot.getIn(['data', 'kafkaClient.producer.clientIds']);
    ids.forEach(producerId => {
      rows.push({
        key: String(producerId) + jvmSnapshot.get('id'),
        producerId: String(producerId),
        name: String(producerId.split('#')[1]),
        snapshotId: jvmSnapshot.get('id'),
        timeConfig
      });
    });
  });

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.kafkaCluster.producersWithCount', { len: rows.length })}
      rows={rows}
      cols={cols}
      getRowDetails={getDetails}
    />
  );
}

function getDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        formatter: bytesPerSecondTwoDecimalPlaces,
        tooltipFormatter: bytesPerSecondTwoDecimalPlaces,
        metrics: [`kafkaClient.producer.${row.producerId}.producerOutgoingByteRate`],
        labels: [t('in-forge:plugins.kafkaCluster.byteRate')],
        type: 'line'
      }}
      y2={{
        formatter: millis.compact,
        tooltipFormatter: millis.compact,
        metrics: [
          `kafkaClient.producer.${row.producerId}.produceThrottleTime`,
          `kafkaClient.producer.${row.producerId}.produceRequestLatency`
        ],
        labels: [t('in-forge:plugins.kafkaCluster.throttling'), t('in-forge:plugins.kafkaCluster.latency')],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
