/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { bytesZeroDecimalPlaces, bytesTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.rabbitMq.dashboard.node'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.rabbitMq.dashboard.fileDescriptorsUsed'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `node_map.${row.key}.fd_used`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.rabbitMq.dashboard.memoryUsed'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `node_map.${row.key}.mem_used`;
      },
      getContent: bytesZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.rabbitMq.dashboard.socketsUsed'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `node_map.${row.key}.sockets_used`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.rabbitMq.dashboard.erlangProcesses'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `node_map.${row.key}.proc_used`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.rabbitMq.dashboard.diskFree'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `node_map.${row.key}.disk_free`;
      },
      getContent: bytesZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.rabbitMq.dashboard.diskAlarmThreshold'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `node_map.${row.key}.disk_free_limit`;
      },
      getContent: bytesZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function NodesTable({ snapshot, timeConfig }) {
  const nodes = snapshot
    .getIn(['data', 'nodes'], emptyList)
    .toArray()
    .sort();
  if (nodes.length === 0) {
    return null;
  }

  const rows = nodes.map(node => {
    return {
      key: node,
      timeConfig,
      snapshotId: snapshot.get('id')
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.rabbitMq.dashboard.nodesWithCount', {
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

  return (
    <div>
      <Columize>
        <div>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['node_map.' + row.key + '.fd_used', 'node_map.' + row.key + '.fd_total'],
              labels: [
                t('in-forge:plugins.rabbitMq.dashboard.fileDescriptorsUsed'),
                t('in-forge:plugins.rabbitMq.dashboard.totalFileDescriptors')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: bytesZeroDecimalPlaces,
              tooltipFormatter: bytesTwoDecimalPlaces,
              metrics: ['node_map.' + row.key + '.mem_used', 'node_map.' + row.key + '.mem_limit'],
              labels: [
                t('in-forge:plugins.rabbitMq.dashboard.memoryUsed'),
                t('in-forge:plugins.rabbitMq.dashboard.memoryLimit')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </div>
        <div>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['node_map.' + row.key + '.proc_used', 'node_map.' + row.key + '.proc_total'],
              labels: [
                t('in-forge:plugins.rabbitMq.dashboard.erlangProcessesUsed'),
                t('in-forge:plugins.rabbitMq.dashboard.maxErlangProcesses')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />

          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: bytesZeroDecimalPlaces,
              tooltipFormatter: bytesTwoDecimalPlaces,
              metrics: ['node_map.' + row.key + '.disk_free', 'node_map.' + row.key + '.disk_free_limit'],
              labels: [
                t('in-forge:plugins.rabbitMq.dashboard.diskFreeSpace'),
                t('in-forge:plugins.rabbitMq.dashboard.diskAlarmThreshold')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </div>
      </Columize>

      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          metrics: ['node_map.' + row.key + '.sockets_used', 'node_map.' + row.key + '.sockets_total'],
          labels: [
            t('in-forge:plugins.rabbitMq.dashboard.socketsUsed'),
            t('in-forge:plugins.rabbitMq.dashboard.totalSockets')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
