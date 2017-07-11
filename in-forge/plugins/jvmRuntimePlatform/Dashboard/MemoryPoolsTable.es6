import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-components/Chart'
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { getMaxValue } from 'in-sdk/metrics';

const cols = [
  {
    title: 'Pool',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: 'Initial',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.pool.get('initial');
      },
      getContent: bytesTwoDecimalPlaces
    }
  },
  {
    title: 'Maximum',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.pool.get('max');
      },
      getContent: formatMax
    }
  },
  {
    title: 'Value',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `pools.${row.name}`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function MemoryPoolsTable({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'jvm.pools'], emptyMap)
    .map((pool, name) => {
      return {
        key: name,
        name,
        pool,
        snapshot,
        snapshotId,
        timeframe
      };
    })
    .valueSeq()
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  return (
    <DashboardSection title={`Memory Pools (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getDetails} />
    </DashboardSection>
  );
}

function formatMax(bytes) {
  return bytes === -1 ? 'unlimited' : bytesTwoDecimalPlaces(bytes);
}

function getDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeframe={row.timeframe}
      margins={{
        left: 80
      }}
      y1={{
        max: getMaxValue('pools.' + row.name, row.snapshot),
        formatter: bytesTwoDecimalPlaces,
        tooltipFormatter: bytesTwoDecimalPlaces,
        metrics: ['pools.' + row.name],
        labels: [row.name + ' Usage'],
        type: 'line'
      }}
    />
  );
}
