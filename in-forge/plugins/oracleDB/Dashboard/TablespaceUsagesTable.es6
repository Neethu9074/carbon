import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { bytes, percentage } from 'in-services/formatters/number';
import Chart from 'in-components/Chart'
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Used Space',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `stats.tablespaceStats.${row.key}.usedSpace`;
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Used Percent',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `stats.tablespaceStats.${row.key}.usedPercent`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Maximum Tablespace Size',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.tablespace.get('maxSize');
      },
      getContent: bytes.detailed
    }
  },
  {
    title: 'Autoextensible',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.tablespace.get('autoextensible');
      }
    }
  }
];

export default function DatasourcesTable({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'tablespaces'], emptyMap)
    .map((tablespace, key) => {
      return {
        key,
        tablespace,
        timeframe,
        snapshotId
      };
    })
    .valueSeq()
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  return (
    <DashboardSection title={`Tablespaces ${rows.length}`}>
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
  );
}

function getRowDetails(row) {
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeframe={row.timeframe}
        margins={{
          left: 80
        }}
        y1={{
          formatter: bytes.detailed,
          metrics: ['stats.tablespaceStats.' + row.key + '.usedSpace'],
          labels: ['Used Space'],
          type: 'area'
        }}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeframe={row.timeframe}
        margins={{
          left: 80
        }}
        y1={{
          min: 0,
          max: 1,
          formatter: percentage.detailed,
          metrics: ['stats.tablespaceStats.' + row.key + '.usedPercent'],
          labels: ['Used Percent'],
          type: 'area'
        }}
      />
    </div>
  );
}
