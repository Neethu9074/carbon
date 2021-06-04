/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { bytes, percentage } from 'in-services/formatters/number';
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
    title: t('in-forge:plugins.ibmCloudPostgreSql.titleUsed'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `members.${row.name}.memory_used_bytes`;
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudPostgreSql.titleLimit'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `members.${row.name}.memory_limit_bytes`;
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudPostgreSql.titleUsedPercent'),
    //type: 'metric',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `members.${row.name}.memory_used_percent`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function MemoryTable({ snapshot, timeConfig, memberIds }) {
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
      cardTitle={t('in-forge:plugins.ibmCloudPostgreSql.titleMemory')}
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
      <DashboardSection>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            formatter: bytes.detailed,
            metrics: ['members.' + row.name + '.memory_used_bytes'],
            labels: [t('in-forge:plugins.ibmCloudPostgreSql.labelUsedBytes')],
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
            metrics: ['members.' + row.name + '.memory_used_percent'],
            labels: [t('in-forge:plugins.ibmCloudPostgreSql.memoryUtilization')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </Columize>
  );
}
