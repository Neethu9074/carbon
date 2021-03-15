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
        return `kafkaClient.consumer.${row.consumerId}.consumedByteRate`;
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
        return `kafkaClient.consumer.${row.consumerId}.consumerFetchThrottleTime`;
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
        return `kafkaClient.consumer.${row.consumerId}.consumerFetchLatency`;
      },
      getContent: millis.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ConsumersTable({ clientSnapshots, timeConfig }) {
  if (!clientSnapshots) {
    return null;
  }

  let rows = [];

  clientSnapshots.forEach(jvmSnapshot => {
    const ids = jvmSnapshot.getIn(['data', 'kafkaClient.consumer.clientIds']);
    ids.forEach(consumerId => {
      rows.push({
        key: String(consumerId) + jvmSnapshot.get('id'),
        consumerId: String(consumerId),
        name: String(consumerId.split('#')[1]),
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
      cardTitle={t('in-forge:plugins.kafkaCluster.consumersWithCount', { len: rows.length })}
      cols={cols}
      rows={rows}
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
        metrics: [`kafkaClient.consumer.${row.consumerId}.consumedByteRate`],
        labels: [t('in-forge:plugins.kafkaCluster.byteRate')],
        type: 'line'
      }}
      y2={{
        formatter: millis.compact,
        tooltipFormatter: millis.compact,
        metrics: [
          `kafkaClient.consumer.${row.consumerId}.consumerFetchThrottleTime`,
          `kafkaClient.consumer.${row.consumerId}.consumerFetchLatency`
        ],
        labels: [t('in-forge:plugins.kafkaCluster.throttling'), t('in-forge:plugins.kafkaCluster.latency')],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
