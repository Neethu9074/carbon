/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { percentage, bytes } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const deviceColumn = {
  title: t('in-forge:plugins.lxc.device'),
  type: 'string',
  typeArgs: {
    getValue(row) {
      return row.snapshot.getIn(['data', 'filesystems.' + row.key + '.device']);
    }
  }
};

const mountColumn = {
  title: t('in-forge:plugins.lxc.mount'),
  type: 'string',
  typeArgs: {
    getValue(row) {
      return row.key;
    }
  }
};
const optionsColumn = {
  title: t('in-forge:plugins.lxc.options'),
  type: 'string',
  typeArgs: {
    getValue(row) {
      return row.snapshot.getIn(['data', 'filesystems.' + row.key + '.options']);
    }
  }
};
const typeColumn = {
  title: t('in-forge:plugins.lxc.type'),
  type: 'string',
  typeArgs: {
    getValue(row) {
      return row.snapshot.getIn(['data', 'filesystems.' + row.key + '.type']);
    }
  }
};

const totalColumn = {
  title: t('in-forge:plugins.lxc.total'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row) {
      return row.snapshotId;
    },
    getMetricName(row) {
      return `filesystems.${row.key}.total`;
    },
    getContent: bytes.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

const usedColumn = {
  title: t('in-forge:plugins.lxc.used'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row) {
      return row.snapshotId;
    },
    getMetricName(row) {
      return `filesystems.${row.key}.usedPercentage`;
    },
    getContent: percentage.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

export default function FilesystemsTable({ snapshot, timeConfig }) {
  const mountpoints = snapshot.getIn(['data', 'filesystems.mountpoints'], emptyList);
  const snapshotId = snapshot.get('id');

  if (mountpoints.size === 0) {
    return null;
  }

  const rows = mountpoints.toArray().map(key => {
    return {
      key,
      snapshot,
      snapshotId,
      timeConfig
    };
  });

  const cols = [deviceColumn, mountColumn, optionsColumn, typeColumn, totalColumn, usedColumn];

  return (
    <Table
      cardTitle={t('in-forge:plugins.lxc.filesystems')}
      withoutPadding
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
      initialSortDirection="desc"
      initialSortColumn={cols.indexOf(usedColumn)}
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
        formatter: bytes,
        tooltipFormatter: bytes.detailed,
        metrics: ['filesystems.' + row.key + '.free'],
        labels: [t('in-forge:plugins.lxc.free')],
        type: 'line'
      }}
      y2={{
        min: 0,
        formatter: percentage,
        tooltipFormatter: percentage.detailed,
        metrics: ['filesystems.' + row.key + '.usedPercentage'],
        labels: [t('in-forge:plugins.lxc.used')],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
