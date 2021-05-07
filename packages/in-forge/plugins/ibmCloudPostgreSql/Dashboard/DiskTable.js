/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { bytes, percentage, zeroDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import { getRawPayload } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
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
    title: t('in-forge:plugins.ibmCloudPostgreSql.titleUsed'),
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
    title: t('in-forge:plugins.ibmCloudPostgreSql.titleTotal'),
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
  },
  {
    title: t('in-forge:plugins.ibmCloudPostgreSql.titleUsedPercent'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `members.${row.name}.disk_used_percent`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudPostgreSql.labelDiskIOPercent'),
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
    title: t('in-forge:plugins.ibmCloudPostgreSql.titleIOPSTotal'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `members.${row.name}.iops_read_write_total`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      member_ids: getRawPayload(props.snapshot.get('id'), 'member_ids')
    };
  },
  function DiskTable({ snapshot, timeConfig, member_ids }) {
    if (!member_ids || member_ids.isEmpty()) {
      return null;
    }

    const rows = member_ids.toArray().map(member => {
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
);

function getDetails(row) {
  return (
    <Columize>
      <DashboardSection>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            formatter: bytes.detailed,
            metrics: ['members.' + row.name + '.disk_used_bytes'],
            labels: [t('in-forge:plugins.ibmCloudPostgreSql.usedBytes')],
            type: 'line'
          }}
          y2={{
            min: 0,
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
            metrics: ['members.' + row.name + '.iops_read_write_total'],
            labels: [t('in-forge:plugins.ibmCloudPostgreSql.titleIOPSTotal')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </Columize>
  );
}
