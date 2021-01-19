/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import TableExplanation from 'in-sdk/components/dashboard/TableExplanation';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { bytes } from 'in-services/formatters/number';
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

export default function MemoryPoolsTable({ snapshot, timeConfig }) {
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
        timeConfig
      };
    })
    .valueSeq()
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  const explanation = (
    <TableExplanation>
      Not all memory pools are considered to be part of the JVM heap. Usually only <code>Eden</code>,{' '}
      <code>Survivor</code> and <code>Old</code> are part of the heap. Depending on the configuration of the JVM it may
      resize any of these pools.
    </TableExplanation>
  );

  return (
    <Table
      cardTitle={`Memory Pools`}
      withoutPadding
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
      explanation={explanation}
    />
  );
}

function formatMax(bytes) {
  return bytes === -1 ? 'unlimited' : bytesTwoDecimalPlaces(bytes);
}

function getDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        max: getMaxValue('pools.' + row.name, row.snapshot),
        formatter: bytes.detailed,
        tooltipFormatter: bytes.detailedWithRaw,
        metrics: ['pools.' + row.name],
        labels: [row.name + ' Usage'],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
