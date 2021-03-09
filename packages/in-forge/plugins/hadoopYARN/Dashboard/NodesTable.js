/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { zeroDecimalPlaces, bytesZeroDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { formatDateTime } from 'in-services/formatters/date';
import Columize from 'in-sdk/components/dashboard/Columize';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.hadoopYARN.dashboard.labels'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.node.get('labels', emptyList).join(', ');
      }
    }
  },
  {
    title: t('in-forge:plugins.hadoopYARN.dashboard.state'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.node.get('state');
      }
    }
  },
  {
    title: t('in-forge:plugins.hadoopYARN.dashboard.rack'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.node.get('rack');
      }
    }
  },
  {
    title: t('in-forge:plugins.hadoopYARN.dashboard.httpAddress'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.node.get('httpAddress');
      }
    }
  },
  {
    title: t('in-forge:plugins.hadoopYARN.dashboard.lastHealthUpdate'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.node.get('lastHealthUpdate');
      },
      getContent: formatDateTime
    }
  },
  {
    title: t('in-forge:plugins.hadoopYARN.dashboard.healthReport'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.node.get('healthReport');
      }
    }
  },
  {
    title: t('in-forge:plugins.hadoopYARN.dashboard.containersRunning'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `nodes.${row.node.get('id')}.containers`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.hadoopYARN.dashboard.memoryAvailable'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `nodes.${row.node.get('id')}.memoryAvailable`;
      },
      getContent: bytesZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.hadoopYARN.dashboard.virtualCoresAvailable'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `nodes.${row.node.get('id')}.virtualCoresAvailable`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function NodesTable({ snapshot, timeConfig }) {
  const nodes = snapshot.getIn(['data', 'nodes.nodeList'], emptyList);
  if (nodes.size === 0) {
    return null;
  }

  const rows = nodes
    .map(node => {
      return {
        key: node.get('id'),
        node,
        timeConfig,
        snapshotId: snapshot.get('id')
      };
    })
    .toArray();

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.hadoopYARN.dashboard.nodes')}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
    />
  );
}

function getDetails(row) {
  const id = row.node.get('id');
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: ['nodes.' + id + '.containers'],
          labels: [t('in-forge:plugins.hadoopYARN.dashboard.containersRunning')],
          type: 'stackedArea'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Columize>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: bytesZeroDecimalPlaces,
            tooltipFormatter: bytesTwoDecimalPlaces,
            metrics: ['nodes.' + id + '.memoryUsed', 'nodes.' + id + '.memoryAvailable'],
            labels: [
              t('in-forge:plugins.hadoopYARN.dashboard.memoryUsed'),
              t('in-forge:plugins.hadoopYARN.dashboard.memoryAvailable')
            ],
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['nodes.' + id + '.virtualCoresUsed', 'nodes.' + id + '.virtualCoresAvailable'],
            labels: [
              t('in-forge:plugins.hadoopYARN.dashboard.virtualCoresUsed'),
              t('in-forge:plugins.hadoopYARN.dashboard.virtualCoresAvailable')
            ],
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </Columize>
    </div>
  );
}
