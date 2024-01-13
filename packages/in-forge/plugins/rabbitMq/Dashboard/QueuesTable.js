/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.rabbitMq.dashboard.queue'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.rabbitMq.dashboard.messagesReady'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'queue_map.' + row.key + '.messages_ready';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.rabbitMq.dashboard.messagesUnacknowledged'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'queue_map.' + row.key + '.messages_unacknowledged';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.rabbitMq.dashboard.messagesTotal'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'queue_map.' + row.key + '.messages';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.rabbitMq.dashboard.consumers'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'queue_map.' + row.key + '.consumers';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function QueuesTable({ snapshot, timeConfig }) {
  const queues = snapshot.getIn(['data', 'monitoredQueues'], emptyList).toArray().sort();
  if (queues.length === 0) {
    return null;
  }

  const rows = queues.map(queue => {
    return {
      key: queue,
      timeConfig,
      snapshotId: snapshot.get('id')
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.rabbitMq.dashboard.queuesWithCount', {
        len: rows.length
      })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row) {
  const snapshotId = row.snapshotId;
  const timeConfig = row.timeConfig;
  const rowKey = row.key;

  return (
    <div>
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          metrics: [
            'queue_map.' + rowKey + '.messages_ready',
            'queue_map.' + rowKey + '.messages_unacknowledged',
            'queue_map.' + rowKey + '.messages'
          ],
          labels: [
            t('in-forge:plugins.rabbitMq.dashboard.messagesReady'),
            t('in-forge:plugins.rabbitMq.dashboard.messagesUnacknowledged'),
            t('in-forge:plugins.rabbitMq.dashboard.messagesTotal')
          ],
          type: 'stackedArea',
          formatter: zeroDecimalPlaces
        }}
        y2={{
          metrics: ['queue_map.' + rowKey + '.consumers'],
          labels: [t('in-forge:plugins.rabbitMq.dashboard.consumers')],
          type: 'line',
          formatter: zeroDecimalPlaces
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
