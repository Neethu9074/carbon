/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { percentage, zeroDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmCloudEtcd.memberID'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudEtcd.diskIOPercent'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `members.${row.name}.disk_io_utilization_percent_average_5m`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudEtcd.iOPSTotal'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `members.${row.name}.disk_iops_read_write_total`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function DiskIOTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'member_ids'], emptyList)
    .toArray()
    .map(name => {
      return {
        key: name,
        name,
        snapshotId,
        timeConfig
      };
    });

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.ibmCloudEtcd.titleDiskIO')}
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
        metrics: ['members.' + row.name + '.disk_io_utilization_percent_average_5m'],
        labels: [t('in-forge:plugins.ibmCloudEtcd.diskIOPercent')],
        type: 'line'
      }}
      y2={{
        min: 0,
        formatter: zeroDecimalPlaces,
        metrics: ['members.' + row.name + '.disk_iops_read_write_total'],
        labels: [t('in-forge:plugins.ibmCloudEtcd.iOPSTotal')],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
