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

const cols = [
  {
    title: 'Device',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: 'Mount',
    type: 'string',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getValue(row) {
        return row.filesystem.get('mountpoint');
      }
    }
  },
  {
    title: 'Mode',
    type: 'string',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getValue(row) {
        return row.filesystem.get('mode');
      }
    }
  },
  {
    title: 'Type',
    type: 'string',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getValue(row) {
        return row.filesystem.get('type');
      }
    }
  },
  {
    title: 'Used',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `filesystems.${row.name}.bytes_used`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Inode used',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `filesystems.${row.name}.inode_used`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function FileSystemsTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'filesystems'], emptyMap)
    .map((filesystem, name) => {
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

function getDetails(row) {
  return (
    <>
      <Columize>
        <Chart
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
            formatter: timeBySecondsTwoDecimalPlaces,
            metrics: ['filesystems.' + row.name + '.inode_used', 'filesystems.' + row.name + '.inode_free'],
            labels: ['Inode Used', 'Inode Free'],
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
            metrics: ['filesystems.' + row.name + '.bytes_used', 'filesystems.' + row.name + '.inode_used'],
            labels: ['Bytes Used', 'Inode Used'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </Columize>
    </>
  );
}
