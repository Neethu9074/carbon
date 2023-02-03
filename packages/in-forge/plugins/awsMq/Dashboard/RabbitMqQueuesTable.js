/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { emptyList } from 'in-services/fixedImmutables';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.awsMq.queue'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.awsMq.dashboard.consumerCount'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return row.metricPrefix + '.consumer_count';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.awsMq.dashboard.ready'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return row.metricPrefix + '.message_ready_count';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.awsMq.dashboard.unacknowledged'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return row.metricPrefix + '.message_unacknowledged_count';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.awsMq.dashboard.total'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return row.metricPrefix + '.message_count';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function RabbitMqQueuesTable({ snapshot, timeConfig }) {
  const queues = snapshot.getIn(['data', 'queues'], emptyList);
  if (queues.size === 0) {
    return null;
  }

  const rows = queues
    .map(queue => {
      return {
        key: queue,
        timeConfig,
        snapshotId: snapshot.get('id'),
        metricPrefix: 'queueMetrics.' + queue
      };
    })
    .toArray();

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.awsMq.dashboard.queuesRows', { rows: rows.length })}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
    />
  );
}

function getDetails(row) {
  const snapshotId = row.snapshotId;
  const timeConfig = row.timeConfig;

  return (
    <div>
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          min: 0,
          metrics: [row.metricPrefix + '.consumer_count'],
          labels: [t('in-forge:plugins.awsMq.dashboard.consumerCount')],
          type: 'line',
          formatter: number.compact
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          metrics: [
            row.metricPrefix + '.message_ready_count',
            row.metricPrefix + '.message_unacknowledged_count',
            row.metricPrefix + '.message_count'
          ],
          labels: [
            t('in-forge:plugins.awsMq.dashboard.ready'),
            t('in-forge:plugins.awsMq.dashboard.unacknowledged'),
            t('in-forge:plugins.awsMq.dashboard.total')
          ],
          type: 'line',
          formatter: number.compact
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
