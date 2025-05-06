/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Range } from 'immutable';
import React from 'react';

import { percentage, number, twoDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { isLinux } from 'in-forge/plugins/host/hostUtils';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const CpuNumberColumn = {
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
};
const CpuUserColumn = {
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
};
const CpuSystemColumn = {
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
};
const CpuWaitColumn = {
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
};
const CpuNiceColumn = {
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
};
const CpuStealColumn = {
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
};
const CpuIdleColumn = {
  id: 'idle',
  title: t('in-forge:plugins.host.dashboard.idle'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row) {
      return row.snapshotId;
    },
    getMetricName(row) {
      return `cpus.${row.cpuNumber}.idle`;
    },
    getContent: percentage.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

const UserSystemCpuRatioColumn = {
  id: 'usersysratio',
  title: t('in-forge:plugins.host.dashboard.usersysratio'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row) {
      return row.snapshotId;
    },
    getMetricName(row) {
      return `cpus.${row.cpuNumber}.usersysratio`;
    },
    getContent: number.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

export default function CpuTable({ snapshot, timeConfig }) {
  const cpuCount = snapshot.getIn(['data', 'cpu.count'], 1);
  const linux = isLinux(snapshot);

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
        snapshotId: snapshot.get('id'),
        linux
      };
    });

  const cols = [CpuNumberColumn, CpuUserColumn, CpuSystemColumn, CpuWaitColumn, CpuNiceColumn, CpuStealColumn];

  if (linux) {
    cols.push(CpuIdleColumn);
    cols.push(UserSystemCpuRatioColumn);
  }
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
    <>
      {row.linux && (
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
              'cpus.' + row.cpuNumber + '.steal',
              'cpus.' + row.cpuNumber + '.idle'
            ],
            labels: [
              t('in-forge:plugins.host.dashboard.user'),
              t('in-forge:plugins.host.dashboard.system'),
              t('in-forge:plugins.host.dashboard.wait'),
              t('in-forge:plugins.host.dashboard.nice'),
              t('in-forge:plugins.host.dashboard.steal'),
              t('in-forge:plugins.host.dashboard.idle')
            ],
            type: 'stackedArea'
          }}
          y2={{
            min: 0,
            max: 1,
            formatter: twoDecimalPlaces,
            metrics: ['cpus.' + row.cpuNumber + '.usersysratio'],
            labels: [t('in-forge:plugins.host.dashboard.usersysratio')],
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      )}
      {!row.linux && (
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
      )}
    </>
  );
}
