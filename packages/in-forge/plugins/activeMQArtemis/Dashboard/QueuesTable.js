/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number } from 'in-services/formatters/number';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: t('in-forge:plugins.activeMQArtemis.name'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.activeMQArtemis.messageCount'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'queues.' + row.key + '.messageCount';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.activeMQArtemis.messagesAdded'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'queues.' + row.key + '.messagesAdded';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.activeMQArtemis.messagesAcknowledged'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'queues.' + row.key + '.messagesAcknowledged';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.activeMQArtemis.messagesExpired'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'queues.' + row.key + '.messagesExpired';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.activeMQArtemis.messagesKilled'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'queues.' + row.key + '.messagesKilled';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function QueuesTable({ snapshot, timeConfig }) {
  const queueNames = snapshot.getIn(['data', 'monitoredQueueNames'], emptyMap);
  if (queueNames.size === 0) {
    return null;
  }
  const rows = queueNames.toArray().map(key => {
    return {
      key,
      snapshotId: snapshot.get('id'),
      timeConfig
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.activeMQArtemis.queuesNumber', { number: rows.length })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row) {
  const snapshotId = row.snapshotId;
  const timeConfig = row.timeConfig;

  return (
    <Chart
      snapshotId={snapshotId}
      timeConfig={timeConfig}
      y1={{
        formatter: number.compact,
        metrics: [
          'queues.' + row.key + '.messageCount',
          'queues.' + row.key + '.messagesAdded',
          'queues.' + row.key + '.messagesAcknowledged',
          'queues.' + row.key + '.messagesExpired',
          'queues.' + row.key + '.messagesKilled'
        ],
        labels: [
          t('in-forge:plugins.activeMQArtemis.count'),
          t('in-forge:plugins.activeMQArtemis.added'),
          t('in-forge:plugins.activeMQArtemis.acknowledged'),
          t('in-forge:plugins.activeMQArtemis.expired'),
          t('in-forge:plugins.activeMQArtemis.killed')
        ],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
