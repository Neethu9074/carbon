/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import { percentage, bytes, kiloBytes, withSiMultiplyPrefixThreeDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { isWindows } from 'in-forge/plugins/host/hostUtils';
import Columize from 'in-sdk/components/dashboard/Columize';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { getMaxValue } from 'in-sdk/metrics';

const deviceColumn = {
  title: 'Device',
  type: 'string',
  typeArgs: {
    getValue(row) {
      return row.key;
    }
  }
};
const mountColumn = {
  title: 'Mount',
  type: 'string',
  typeArgs: {
    getValue(row) {
      return row.filesystem.get('mount');
    }
  }
};
const optionsColumn = {
  title: 'Options',
  type: 'string',
  typeArgs: {
    getValue(row) {
      return row.filesystem.get('options');
    }
  }
};
const typeColumn = {
  title: 'Type',
  type: 'string',
  typeArgs: {
    getValue(row) {
      return row.filesystem.get('systype');
    }
  }
};
const capacityColumn = {
  title: 'Capacity',
  type: 'number',
  typeArgs: {
    getValue(row) {
      return row.filesystem.get('capacity');
    },
    getContent: kiloBytes.detailed
  }
};
const usedColumn = {
  title: 'Used',
  type: 'metric',
  typeArgs: {
    getSnapshotId(row) {
      return row.snapshotId;
    },
    getMetricName(row) {
      return `fs.${row.key}.used`;
    },
    getContent: percentage.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};
const leakedColumn = {
  title: 'Leaked',
  type: 'metric',
  typeArgs: {
    getSnapshotId(row) {
      return row.snapshotId;
    },
    getMetricName(row) {
      return `fs.${row.key}.leaked`;
    },
    getContent: kiloBytes.detailed,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

const iNodeUsageColumn = {
  title: 'Inode usage',
  type: 'metric',
  typeArgs: {
    getSnapshotId(row) {
      return row.snapshotId;
    },
    getMetricName(row) {
      return `fs.${row.key}.inodeUsage`;
    },
    getContent: percentage.compact,
    getTimeWindowAggregation() {
      return 'mean';
    },
    getFallbackContent() {
      return 'N/A';
    }
  }
};

export default function FilesystemsTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const windows = isWindows(snapshot);
  const rows = snapshot
    .getIn(['data', 'filesystems'], emptyMap)
    .map((filesystem, name) => {
      return {
        key: name,
        filesystem,
        timeConfig,
        snapshotId,
        snapshot,
        windows
      };
    })
    .valueSeq()
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  const cols = [deviceColumn, optionsColumn, typeColumn, capacityColumn, usedColumn, leakedColumn];

  if (!windows) {
    cols.splice(1, 0, mountColumn);
    cols.push(iNodeUsageColumn);
  }

  return (
    <Table
      cardTitle="Filesystems"
      withoutPadding
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
      initialSortDirection="desc"
      initialSortColumn={cols.indexOf(usedColumn)}
    />
  );
}

function getDetails(row) {
  return (
    <Fragment>
      <Columize>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            max: getMaxValue('fs.' + row.key + '.free', row.snapshot),
            formatter: kiloBytes.detailed,
            tooltipFormatter: kiloBytes.detailed,
            metrics: ['fs.' + row.key + '.free', 'fs.' + row.key + '.leaked'],
            labels: ['Free', 'Leaked'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />

        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            formatter: withSiMultiplyPrefixThreeDecimalPlaces,
            tooltipFormatter: withSiMultiplyPrefixThreeDecimalPlaces,
            metrics: ['fs.' + row.key + '.reads', 'fs.' + row.key + '.writes'],
            labels: ['Reads/s', 'Writes/s'],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: bytes.detailed,
            tooltipFormatter: bytes.detailed,
            metrics: ['fs.' + row.key + '.readBytes', 'fs.' + row.key + '.writeBytes'],
            labels: ['Bytes Read/s', 'Bytes Written/s'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </Columize>
      {!row.windows && row.filesystem.get('icapacity') && (
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            max: getMaxValue('fs.' + row.key + '.inodeUsage', row.snapshot),
            metrics: ['fs.' + row.key + '.inodeUsage'],
            labels: ['Inode Usage'],
            type: 'line',
            formatter: percentage,
            tooltipFormatter: percentage.compact
          }}
          y2={{
            min: 0,
            max: getMaxValue('fs.' + row.key + '.ifree', row.snapshot),
            metrics: ['fs.' + row.key + '.ifree'],
            labels: ['Inode Free'],
            type: 'line',
            formatter: withSiMultiplyPrefixThreeDecimalPlaces,
            tooltipFormatter: withSiMultiplyPrefixThreeDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      )}
    </Fragment>
  );
}
