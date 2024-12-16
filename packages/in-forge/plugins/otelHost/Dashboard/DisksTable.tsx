/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { WINDOW_FOR_LATEST_METRIC, DISTANCE_BETWEEN_DATAPOINTS } from 'in-forge/plugins/otelHost/constants';
import { timeBySecondsTwoDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.otelHost.dashboard.device'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.name;
      }
    }
  },
  {
    title: t('in-forge:plugins.otelHost.dashboard.io_read'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.snapshotId;
      },
      getMetricName(row: any) {
        return `disks.${row.name}.io_read`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      },
      getWindowForLatest() {
        return WINDOW_FOR_LATEST_METRIC;
      }
    }
  },
  {
    title: t('in-forge:plugins.otelHost.dashboard.io_write'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.snapshotId;
      },
      getMetricName(row: any) {
        return `disks.${row.name}.io_write`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      },
      getWindowForLatest() {
        return WINDOW_FOR_LATEST_METRIC;
      }
    }
  },
  {
    title: t('in-forge:plugins.otelHost.dashboard.io_tim'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.snapshotId;
      },
      getMetricName(row: any) {
        return `disks.${row.name}.io_tim`;
      },
      getContent: timeBySecondsTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      },
      getWindowForLatest() {
        return WINDOW_FOR_LATEST_METRIC;
      }
    }
  },
  {
    title: t('in-forge:plugins.otelHost.dashboard.oper_read'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.snapshotId;
      },
      getMetricName(row: any) {
        return `disks.${row.name}.oper_read`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      },
      getWindowForLatest() {
        return WINDOW_FOR_LATEST_METRIC;
      }
    }
  },
  {
    title: t('in-forge:plugins.otelHost.dashboard.oper_tim_read'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.snapshotId;
      },
      getMetricName(row: any) {
        return `disks.${row.name}.oper_tim_read`;
      },
      getContent: timeBySecondsTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      },
      getWindowForLatest() {
        return WINDOW_FOR_LATEST_METRIC;
      }
    }
  },
  {
    title: t('in-forge:plugins.otelHost.dashboard.oper_write'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.snapshotId;
      },
      getMetricName(row: any) {
        return `disks.${row.name}.oper_write`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      },
      getWindowForLatest() {
        return WINDOW_FOR_LATEST_METRIC;
      }
    }
  },
  {
    title: t('in-forge:plugins.otelHost.dashboard.oper_tim_write'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.snapshotId;
      },
      getMetricName(row: any) {
        return `disks.${row.name}.oper_tim_write`;
      },
      getContent: timeBySecondsTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      },
      getWindowForLatest() {
        return WINDOW_FOR_LATEST_METRIC;
      }
    }
  },
  {
    title: t('in-forge:plugins.otelHost.dashboard.io_tim_weighted'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.snapshotId;
      },
      getMetricName(row: any) {
        return `disks.${row.name}.io_tim_weighted`;
      },
      getContent: timeBySecondsTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      },
      getWindowForLatest() {
        return WINDOW_FOR_LATEST_METRIC;
      }
    }
  }
];

export default function DisksTable({ snapshot }: { snapshot: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const rows = snapshot
    .getIn(['data', 'disks'], emptyMap)
    .map((disk: any, name: any) => {
      return {
        key: name,
        name: name,
        disk,
        timeConfig,
        snapshotId: snapshot.get('id')
      };
    })
    .valueSeq()
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  return <Table cardTitle={'Disks'} withoutPadding cols={cols} rows={rows} getRowDetails={getDetails} />;
}

function getDetails(row: any) {
  return (
    <>
      <Columize>
        <Chart
          distanceBetweenDatapointsInMillis={DISTANCE_BETWEEN_DATAPOINTS}
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: bytesTwoDecimalPlaces,
            metrics: ['disks.' + row.name + '.io_read', 'disks.' + row.name + '.io_write'],
            labels: [
              t('in-forge:plugins.otelHost.dashboard.io_read'),
              t('in-forge:plugins.otelHost.dashboard.io_write')
            ],
            type: 'line'
          }}
          y2={{
            formatter: timeBySecondsTwoDecimalPlaces,
            metrics: ['disks.' + row.name + '.io_tim', 'disks.' + row.name + '.io_tim_weighted'],
            labels: [
              t('in-forge:plugins.otelHost.dashboard.io_tim'),
              t('in-forge:plugins.otelHost.dashboard.io_tim_weighted')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </Columize>
      <Columize>
        <Chart
          distanceBetweenDatapointsInMillis={DISTANCE_BETWEEN_DATAPOINTS}
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: bytesTwoDecimalPlaces,
            metrics: ['disks.' + row.name + '.oper_read', 'disks.' + row.name + '.oper_write'],

            labels: [
              t('in-forge:plugins.otelHost.dashboard.oper_read'),
              t('in-forge:plugins.otelHost.dashboard.oper_write')
            ],
            type: 'line'
          }}
          y2={{
            formatter: timeBySecondsTwoDecimalPlaces,
            metrics: ['disks.' + row.name + '.oper_tim_read', 'disks.' + row.name + '.oper_tim_write'],
            labels: [
              t('in-forge:plugins.otelHost.dashboard.oper_tim_read'),
              t('in-forge:plugins.otelHost.dashboard.oper_tim_write')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </Columize>
      <Columize>
        <Chart
          distanceBetweenDatapointsInMillis={DISTANCE_BETWEEN_DATAPOINTS}
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: bytesTwoDecimalPlaces,
            metrics: ['disks.' + row.name + '.merged_read', 'disks.' + row.name + '.merged_write'],
            labels: [
              t('in-forge:plugins.otelHost.dashboard.merged_read'),
              t('in-forge:plugins.otelHost.dashboard.merged_write')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </Columize>
    </>
  );
}
