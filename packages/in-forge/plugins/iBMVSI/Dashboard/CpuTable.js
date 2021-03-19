/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { percentage, timeByNanoTwoDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Table from 'in-sdk/components/dashboard/Table';
import { Range } from 'immutable';
import { t } from 'in-i18n';

const cols = [
  {
    id: 'CPU',
    title: t('in-forge:plugins.iBMVSI.titleCPU'),
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
    id: 'cpuUsageTime',
    title: t('in-forge:plugins.iBMVSI.titleCPUTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `cpus.${row.cpuNumber}.cpu_usage_nanoseconds`;
      },
      getContent: timeByNanoTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    id: 'cpuUsagePercent',
    title: t('in-forge:plugins.iBMVSI.titleCPUPercent'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `cpus.${row.cpuNumber}.cpu_usage_percentage`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function CpuTable({ snapshot, timeConfig }) {
  const cpuCount = snapshot.getIn(['data', 'cpuCount'], 1);
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
      cardTitle={t('in-forge:plugins.iBMVSI.labelIndividualCPUUsage')}
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
        formatter: percentage.detailed,
        metrics: ['cpus.' + row.cpuNumber + '.cpu_usage_percentage'],
        labels: [t('in-forge:plugins.iBMVSI.labelUsagePercent')],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
