/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Range } from 'immutable';
import React from 'react';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { WINDOW_FOR_LATEST_METRIC, DISTANCE_BETWEEN_DATAPOINTS } from 'in-forge/plugins/otelHost/constants';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { percentage } from 'in-services/formatters/number';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

const cols = [
  {
    id: 'CPU',
    title: t('in-forge:plugins.otelHost.dashboard.cpu'),
    type: 'number',
    typeArgs: {
      getValue(row: any) {
        return row.cpuNumber;
      },
      getContent(cpuNumber: any) {
        return `CPU ${cpuNumber}`;
      }
    }
  },
  {
    id: 'User',
    title: t('in-forge:plugins.otelHost.dashboard.user'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.snapshotId;
      },
      getMetricName(row: any) {
        return `cpus.cpu${row.cpuNumber}.user`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      },
      getWindowForLatest() {
        return WINDOW_FOR_LATEST_METRIC;
      }
    }
  },
  {
    id: 'System',
    title: t('in-forge:plugins.otelHost.dashboard.system'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.snapshotId;
      },
      getMetricName(row: any) {
        return `cpus.cpu${row.cpuNumber}.system`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      },
      getWindowForLatest() {
        return WINDOW_FOR_LATEST_METRIC;
      }
    }
  },
  {
    id: 'Wait',
    title: t('in-forge:plugins.otelHost.dashboard.wait'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.snapshotId;
      },
      getMetricName(row: any) {
        return `cpus.cpu${row.cpuNumber}.wait`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      },
      getWindowForLatest() {
        return WINDOW_FOR_LATEST_METRIC;
      }
    }
  },
  {
    id: 'Nice',
    title: t('in-forge:plugins.otelHost.dashboard.nice'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.snapshotId;
      },
      getMetricName(row: any) {
        return `cpus.cpu${row.cpuNumber}.nice`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      },
      getWindowForLatest() {
        return WINDOW_FOR_LATEST_METRIC;
      }
    }
  },
  {
    id: 'Steal',
    title: t('in-forge:plugins.otelHost.dashboard.steal'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.snapshotId;
      },
      getMetricName(row: any) {
        return `cpus.cpu${row.cpuNumber}.steal`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      },
      getWindowForLatest() {
        return WINDOW_FOR_LATEST_METRIC;
      }
    }
  },
  {
    id: 'Interrupt',
    title: t('in-forge:plugins.otelHost.dashboard.interrupt'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.snapshotId;
      },
      getMetricName(row: any) {
        return `cpus.cpu${row.cpuNumber}.interrupt`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      },
      getWindowForLatest() {
        return WINDOW_FOR_LATEST_METRIC;
      }
    }
  },
  {
    id: 'softirq',
    title: t('in-forge:plugins.otelHost.dashboard.softirq'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.snapshotId;
      },
      getMetricName(row: any) {
        return `cpus.cpu${row.cpuNumber}.softirq`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      },
      getWindowForLatest() {
        return WINDOW_FOR_LATEST_METRIC;
      }
    }
  }
];

export default function CpuTable({ snapshot }: { snapshot: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const cpuCount = snapshot.getIn(['data', 'cpucount'], 1);
  if (cpuCount < 2) {
    return null;
  }

  const rows = Range(0, cpuCount)
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
      cardTitle={t('in-forge:plugins.otelHost.dashboard.individualCpuUsage')}
      withoutPadding
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
      maxItemsPerPage={8}
    />
  );
}

function getRowDetails(row: any) {
  return (
    <Chart
      distanceBetweenDatapointsInMillis={DISTANCE_BETWEEN_DATAPOINTS}
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        formatter: percentage.detailed,
        metrics: [
          'cpus.cpu' + row.cpuNumber + '.user',
          'cpus.cpu' + row.cpuNumber + '.system',
          'cpus.cpu' + row.cpuNumber + '.wait',
          'cpus.cpu' + row.cpuNumber + '.nice',
          'cpus.cpu' + row.cpuNumber + '.steal',
          'cpus.cpu' + row.cpuNumber + '.interrupt',
          'cpus.cpu' + row.cpuNumber + '.softirq'
        ],
        labels: [
          t('in-forge:plugins.otelHost.dashboard.user'),
          t('in-forge:plugins.otelHost.dashboard.system'),
          t('in-forge:plugins.otelHost.dashboard.wait'),
          t('in-forge:plugins.otelHost.dashboard.nice'),
          t('in-forge:plugins.otelHost.dashboard.steal'),
          t('in-forge:plugins.otelHost.dashboard.interrupt'),
          t('in-forge:plugins.otelHost.dashboard.softirq')
        ],
        type: 'stackedArea'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
