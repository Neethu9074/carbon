/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { WINDOW_FOR_LATEST_METRIC, DISTANCE_BETWEEN_DATAPOINTS } from 'in-forge/plugins/otelHost/constants';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
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
    title: t('in-forge:plugins.otelHost.dashboard.mount'),
    type: 'string',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.snapshotId;
      },
      getValue(row: any) {
        return row.filesystem.get('mountpoint');
      }
    }
  },
  {
    title: t('in-forge:plugins.otelHost.dashboard.mode'),
    type: 'string',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.snapshotId;
      },
      getValue(row: any) {
        return row.filesystem.get('mode');
      }
    }
  },
  {
    title: t('in-forge:plugins.otelHost.dashboard.type'),
    type: 'string',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.snapshotId;
      },
      getValue(row: any) {
        return row.filesystem.get('type');
      }
    }
  },
  {
    title: t('in-forge:plugins.otelHost.dashboard.bytes_used'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.snapshotId;
      },
      getMetricName(row: any) {
        return `filesystems.${row.name}.bytes_used`;
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
    title: t('in-forge:plugins.otelHost.dashboard.bytes_free'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.snapshotId;
      },
      getMetricName(row: any) {
        return `filesystems.${row.name}.bytes_free`;
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
    title: t('in-forge:plugins.otelHost.dashboard.inode_used'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.snapshotId;
      },
      getMetricName(row: any) {
        return `filesystems.${row.name}.inode_used`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      },
      getWindowForLatest() {
        return WINDOW_FOR_LATEST_METRIC;
      }
    }
  }
];

export default function FileSystemsTable({ snapshot }: { snapshot: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'filesystems'], emptyMap)
    .map((filesystem: any, name: any) => {
      return {
        key: name,
        name: name,
        filesystem,
        timeConfig,
        snapshot,
        snapshotId
      };
    })
    .valueSeq()
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  return <Table cardTitle={'Filesystems'} withoutPadding cols={cols} rows={rows} getRowDetails={getDetails} />;
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
            metrics: [
              'filesystems.' + row.name + '.bytes_used',
              'filesystems.' + row.name + '.bytes_free',
              'filesystems.' + row.name + '.bytes_reserved'
            ],
            labels: ['Bytes Used', 'Bytes Free', 'Bytes Reserved'],
            type: 'line'
          }}
          y2={{
            formatter: bytesTwoDecimalPlaces,
            metrics: ['filesystems.' + row.name + '.inode_used', 'filesystems.' + row.name + '.inode_free'],
            labels: ['Inode Used', 'Inode Free'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </Columize>
    </>
  );
}
