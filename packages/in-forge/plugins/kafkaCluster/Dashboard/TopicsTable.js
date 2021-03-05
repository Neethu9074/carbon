/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { bytesPerSecondTwoDecimalPlaces, number } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: t('in-forge:plugins.kafkaCluster.name'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.kafkaCluster.partitions'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.partitionCount;
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.kafkaCluster.bytesIn'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `broker.topicData.${row.key}.bytesInPerSec`;
      },
      getContent: bytesPerSecondTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.kafkaCluster.bytesOut'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `broker.topicData.${row.key}.bytesOutPerSec`;
      },
      getContent: bytesPerSecondTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.kafkaCluster.bytesRejected'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `broker.topicData.${row.key}.bytesRejectedPerSec`;
      },
      getContent: bytesPerSecondTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.kafkaCluster.messagesIn'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `broker.topicData.${row.key}.messagesInPerSec`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function TopicsTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'partitions'], emptyList)
    .map((partitionCount, topic) => {
      return {
        snapshot,
        snapshotId,
        timeConfig,
        key: topic,
        partitionCount
      };
    })
    .valueSeq()
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.kafkaCluster.topicsWithCount', { len: rows.length })}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
    />
  );
}

function getDetails(row) {
  const key = row.key;
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: bytesPerSecondTwoDecimalPlaces,
          tooltipFormatter: bytesPerSecondTwoDecimalPlaces,
          metrics: [
            `broker.topicData.${key}.bytesInPerSec`,
            `broker.topicData.${key}.bytesOutPerSec`,
            `broker.topicData.${key}.bytesRejectedPerSec`
          ],
          labels: [
            t('in-forge:plugins.kafkaCluster.bytesIn'),
            t('in-forge:plugins.kafkaCluster.bytesOut'),
            t('in-forge:plugins.kafkaCluster.bytesRejected')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: number,
          tooltipFormatter: number.compact,
          metrics: [`broker.topicData.${key}.messagesInPerSec`],
          labels: [t('in-forge:plugins.kafkaCluster.messagesIn')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
