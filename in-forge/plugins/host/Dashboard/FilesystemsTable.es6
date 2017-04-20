import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import { isWindows } from 'in-forge/plugins/host/hostUtils';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { getMaxValue } from 'in-sdk/metrics';
import {
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  kiloBytesZeroDecimalPlaces,
  kiloBytesTwoDecimalPlaces,
  withSiMultiplyPrefixZeroDecimalPlaces,
  withSiMultiplyPrefixThreeDecimalPlaces
} from 'in-services/formatters/number';

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
    getContent: kiloBytesTwoDecimalPlaces
  }
};
const freeColumn = {
  title: 'Free',
  type: 'metric',
  typeArgs: {
    getSnapshotId(row) {
      return row.snapshotId;
    },
    getMetricName(row) {
      return `fs.${row.key}.free`;
    },
    getContent: kiloBytesTwoDecimalPlaces,
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
    getContent: kiloBytesTwoDecimalPlaces,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};
const iFreeColumn = {
  title: 'iFree',
  type: 'metric',
  typeArgs: {
    getSnapshotId(row) {
      return row.snapshotId;
    },
    getMetricName(row) {
      return `fs.${row.key}.ifree`;
    },
    getContent: withSiMultiplyPrefixZeroDecimalPlaces,
    getTimeWindowAggregation() {
      return 'mean';
    },
    fallbackContent: 'N/A'
  }
};

export default function FilesystemsTable({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const windows = isWindows(snapshot);
  const rows = snapshot
    .getIn(['data', 'filesystems'], emptyMap)
    .map((filesystem, name) => {
      return {
        key: name,
        filesystem,
        timeframe,
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

  const cols = [deviceColumn, optionsColumn, typeColumn, capacityColumn, freeColumn, leakedColumn];

  if (!windows) {
    cols.splice(1, 0, mountColumn);
    cols.push(iFreeColumn);
  }

  return (
    <DashboardSection title="Filesystems">
      <Table cols={cols} rows={rows} getRowDetails={getDetails} />
    </DashboardSection>
  );
}

function getDetails(row) {
  return (
    <div>
      {row.windows || !row.filesystem.get('icapacity')
        ? <ChartWithLegend
            snapshotId={row.snapshotId}
            timeframe={row.timeframe}
            margins={{
              left: 80,
              right: 80
            }}
            y1={{
              min: 0,
              max: getMaxValue('fs.' + row.key + '.free', row.snapshot),
              formatter: kiloBytesZeroDecimalPlaces,
              tooltipFormatter: kiloBytesTwoDecimalPlaces,
              metrics: ['fs.' + row.key + '.free', 'fs.' + row.key + '.leaked'],
              labels: ['Free', 'Leaked'],
              type: 'line'
            }}
          />
        : <ChartWithLegend
            snapshotId={row.snapshotId}
            timeframe={row.timeframe}
            margins={{
              left: 80,
              right: 80
            }}
            y1={{
              min: 0,
              max: getMaxValue('fs.' + row.key + '.free', row.snapshot),
              formatter: kiloBytesZeroDecimalPlaces,
              tooltipFormatter: kiloBytesTwoDecimalPlaces,
              metrics: ['fs.' + row.key + '.free', 'fs.' + row.key + '.leaked'],
              labels: ['Free', 'Leaked'],
              type: 'line'
            }}
            y2={{
              min: 0,
              max: getMaxValue('fs.' + row.key + '.ifree', row.snapshot),
              metrics: ['fs.' + row.key + '.ifree'],
              labels: ['iFree'],
              type: 'line',
              formatter: withSiMultiplyPrefixZeroDecimalPlaces,
              tooltipFormatter: withSiMultiplyPrefixThreeDecimalPlaces
            }}
          />}

      <ChartWithLegend
        snapshotId={row.snapshotId}
        timeframe={row.timeframe}
        margins={{
          left: 80,
          right: 80
        }}
        y1={{
          min: 0,
          formatter: withSiMultiplyPrefixZeroDecimalPlaces,
          tooltipFormatter: withSiMultiplyPrefixThreeDecimalPlaces,
          metrics: ['fs.' + row.key + '.reads', 'fs.' + row.key + '.writes'],
          labels: ['Reads/s', 'Writes/s'],
          type: 'line'
        }}
        y2={{
          min: 0,
          formatter: bytesZeroDecimalPlaces,
          tooltipFormatter: bytesTwoDecimalPlaces,
          metrics: ['fs.' + row.key + '.readBytes', 'fs.' + row.key + '.writeBytes'],
          labels: ['Bytes Read/s', 'Bytes Write/s'],
          type: 'line'
        }}
      />
    </div>
  );
}
