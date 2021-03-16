/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Range } from 'immutable';
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { percentage } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    id: 'CPU',
    title: t('in-forge:plugins.host.dashboard.cpu'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.cpuNumber;
      },
      getContent(cpuNumber) {
        return `CPU ${cpuNumber}`;
      }
    }
  },
  {
    id: 'User',
    title: t('in-forge:plugins.host.dashboard.user'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `cpus.${row.cpuNumber}.user`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    id: 'System',
    title: t('in-forge:plugins.host.dashboard.system'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `cpus.${row.cpuNumber}.sys`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    id: 'Wait',
    title: t('in-forge:plugins.host.dashboard.wait'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `cpus.${row.cpuNumber}.wait`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    id: 'Nice',
    title: t('in-forge:plugins.host.dashboard.nice'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `cpus.${row.cpuNumber}.nice`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    id: 'Steal',
    title: t('in-forge:plugins.host.dashboard.steal'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `cpus.${row.cpuNumber}.steal`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function CpuTable({ snapshot, timeConfig }) {
  const cpuCount = snapshot.getIn(['data', 'cpu.count'], 1);
  if (cpuCount < 2) {
    return null;
  }

  const rows = Range(1, cpuCount + 1)
    .toArray()
    .map(cpuNumber => {
      return {
        key: String(cpuNumber),
        cpuNumber,
        timeConfig,
        snapshotId: snapshot.get('id')
      };
    });

  // typical CPU counts are 2, 4, 8, 16, 32, 64
  // to have evenly filled pages, we use 8 as maxItems instead of default 10
  return (
    <Table
      cardTitle={t('in-forge:plugins.host.dashboard.individualCpuUsage')}
      withoutPadding
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
      maxItemsPerPage={8}
    />
  );
}

function getRowDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        min: 0,
        max: 1,
        formatter: percentage.compact,
        metrics: [
          'cpus.' + row.cpuNumber + '.user',
          'cpus.' + row.cpuNumber + '.sys',
          'cpus.' + row.cpuNumber + '.wait',
          'cpus.' + row.cpuNumber + '.nice',
          'cpus.' + row.cpuNumber + '.steal'
        ],
        labels: [
          t('in-forge:plugins.host.dashboard.user'),
          t('in-forge:plugins.host.dashboard.system'),
          t('in-forge:plugins.host.dashboard.wait'),
          t('in-forge:plugins.host.dashboard.nice'),
          t('in-forge:plugins.host.dashboard.steal')
        ],
        type: 'stackedArea'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
