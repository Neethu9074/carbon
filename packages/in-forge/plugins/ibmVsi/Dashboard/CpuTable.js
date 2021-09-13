/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Range } from 'immutable';
import React from 'react';

import { percentage, timeByNanoTwoDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    id: 'CPU',
    title: t('in-forge:plugins.ibmVsi.titleCPU'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return isAggregateRow(row)
          ? `${t('in-forge:plugins.ibmVsi.aggregate')}`
          : `${t('in-forge:plugins.ibmVsi.titleCPU')} ${row.cpuNumber}`;
      }
    }
  },
  {
    id: 'cpuUsageTime',
    title: t('in-forge:plugins.ibmVsi.titleCPUTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return isAggregateRow(row) ? `total_cpu_usage_nanoseconds` : `cpus.${row.cpuNumber}.cpu_usage_nanoseconds`;
      },
      getContent: timeByNanoTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    id: 'cpuUsagePercent',
    title: t('in-forge:plugins.ibmVsi.titleCPUPercent'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return isAggregateRow(row) ? `average_cpu_usage_percentage` : `cpus.${row.cpuNumber}.cpu_usage_percentage`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function CpuTable({ snapshot, timeConfig }) {
  const cpuCount = snapshot.getIn(['data', 'cpuCount'], 0);
  if (cpuCount < 1) {
    return null;
  }

  const rows = Range(0, cpuCount + 1)
    .toArray()
    .map(cpuNumber => {
      return {
        key: String(cpuNumber),
        cpuNumber: String(cpuNumber),
        timeConfig,
        snapshotId: snapshot.get('id')
      };
    });

  // typical CPU counts are 2, 4, 8, 16, 32, 64
  // to have evenly filled pages, we use 8 as maxItems instead of default 10
  return (
    <Table
      cardTitle={t('in-forge:plugins.ibmVsi.titleCPU')}
      withoutPadding
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
      maxItemsPerPage={8}
    />
  );
}

function getRowDetails(row) {
  let usageMetric = `cpus.${row.cpuNumber}.cpu_usage_percentage`,
    timeMetric = `cpus.${row.cpuNumber}.cpu_usage_nanoseconds`;

  if (isAggregateRow(row)) {
    usageMetric = 'average_cpu_usage_percentage';
    timeMetric = 'total_cpu_usage_nanoseconds';
  }

  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        min: 0,
        formatter: timeByNanoTwoDecimalPlaces,
        metrics: [timeMetric],
        labels: [t('in-forge:plugins.ibmVsi.titleCPUTime')],
        type: 'line'
      }}
      y2={{
        min: 0,
        formatter: percentage.detailed,
        metrics: [usageMetric],
        labels: [t('in-forge:plugins.ibmVsi.labelUsagePercent')],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}

function isAggregateRow(row) {
  return row.cpuNumber === '0';
}
