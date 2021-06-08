/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { bytes, percentage, zeroDecimalPlaces, millis } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmCloudPostgreSql.titleMemberID'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudPostgreSql.diskReadLatencyMean'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `members.${row.name}.disk_read_latency_mean`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudPostgreSql.diskWriteLatencyMean'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `members.${row.name}.disk_write_latency_mean`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudPostgreSql.diskUsedBytes'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `members.${row.name}.disk_used_bytes`;
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudPostgreSql.diskTotalBytes'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `members.${row.name}.disk_total_bytes`;
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function DiskTable({ snapshot, timeConfig, memberIds }) {
  if (!memberIds || memberIds.isEmpty()) {
    return null;
  }

  const rows = memberIds.toArray().map(member => {
    return {
      key: member,
      name: member,
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
      cardTitle={t('in-forge:plugins.ibmCloudPostgreSql.titleDisk')}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
      maxItemsPerPage={10}
    />
  );
}

function getDetails(row) {
  return (
    <Columize>
      <DashboardSection title={t('in-forge:plugins.ibmCloudPostgreSql.latency')}>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            formatter: millis.detailed,
            metrics: [
              'members.' + row.name + '.disk_read_latency_mean',
              'members.' + row.name + '.disk_write_latency_mean'
            ],
            labels: [t('in-forge:plugins.ibmCloudPostgreSql.read'), t('in-forge:plugins.ibmCloudPostgreSql.write')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            formatter: bytes.detailed,
            metrics: ['members.' + row.name + '.disk_used_bytes', 'members.' + row.name + '.disk_total_bytes'],
            labels: [t('in-forge:plugins.ibmCloudPostgreSql.used'), t('in-forge:plugins.ibmCloudPostgreSql.total')],
            type: 'line'
          }}
          y2={{
            min: 0,
            max: 1,
            formatter: percentage.detailed,
            metrics: ['members.' + row.name + '.disk_used_percent'],
            labels: [t('in-forge:plugins.ibmCloudPostgreSql.diskUtilization')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            formatter: percentage.detailed,
            metrics: ['members.' + row.name + '.disk_io_utilization_percent_average_5m'],
            labels: [t('in-forge:plugins.ibmCloudPostgreSql.labelDiskIOPercent')],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: zeroDecimalPlaces,
            metrics: ['members.' + row.name + '.disk_iops_read_write_total'],
            labels: [t('in-forge:plugins.ibmCloudPostgreSql.diskIopsReadWriteTotal')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </Columize>
  );
}
