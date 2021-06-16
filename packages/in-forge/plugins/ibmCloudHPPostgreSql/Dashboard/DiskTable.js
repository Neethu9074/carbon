/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { percentage } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmCloudHPPostgreSql.nodeId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudHPPostgreSql.usedPercent'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `nodes.${row.name}.diskPercent`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudHPPostgreSql.mount'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.mount;
      }
    }
  }
];

export default function DiskTable({ snapshot, timeConfig, nodeIds, mounts }) {
  if (!nodeIds || nodeIds.isEmpty()) {
    return null;
  }

  // the mounts sometimes comes in as undefined
  // even though the backend UI sends it correctly.
  let mountNames = [];
  if (mounts && !mounts.isEmpty()) {
    mountNames = mounts.toArray();
  } else {
    mountNames = Array.from(nodeIds, () => '');
  }

  const rows = nodeIds.toArray().map((node, index) => {
    return {
      key: node,
      name: node,
      mount: mountNames[index],
      snapshotId: snapshot.get('id'),
      timeConfig
    };
  });

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.ibmCloudHPPostgreSql.titleDisk')}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
      maxItemsPerPage={10}
    />
  );
}

function getDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        min: 0,
        formatter: percentage.detailed,
        metrics: ['nodes.' + row.name + '.diskPercent'],
        labels: [t('in-forge:plugins.ibmCloudHPPostgreSql.usedPercent')],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
