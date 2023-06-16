/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { timeBySecondsTwoDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Columize from 'in-sdk/components/dashboard/Columize';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.host.dashboard.device'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: 'Bytes I/O Read',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `disks.${row.name}.io_read`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Bytes I/O Write',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `disks.${row.name}.io_write`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'I/O Time',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `disks.${row.name}.io_tim`;
      },
      getContent: timeBySecondsTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Bytes Operation Read',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `disks.${row.name}.oper_read`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Operation Read Time',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `disks.${row.name}.oper_tim_read`;
      },
      getContent: timeBySecondsTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Bytes Operation Write',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `disks.${row.name}.oper_write`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Operation Write Time',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `disks.${row.name}.oper_tim_write`;
      },
      getContent: timeBySecondsTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Weighted I/O Time',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `disks.${row.name}.io_tim_weighted`;
      },
      getContent: timeBySecondsTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function DisksTable({ snapshot, timeConfig }) {
  const rows = snapshot
    .getIn(['data', 'disks'], emptyMap)
    .map((disk, name) => {
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

function getDetails(row) {
  return (
    <>
      <Columize>
        <Chart
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
            metrics: ['disks.' + row.name + '.io_read', 'disks.' + row.name + '.io_tim_weighted'],
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
