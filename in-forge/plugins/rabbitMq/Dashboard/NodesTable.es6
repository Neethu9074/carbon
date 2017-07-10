import React from 'react';

import { bytesZeroDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';
import Chart from 'in-components/Chart'
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Node',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  }
];

export default function NodesTable({ snapshot, timeframe }) {
  const nodes = snapshot.getIn(['data', 'nodes'], emptyList).toArray().sort();
  if (nodes.length === 0) {
    return null;
  }

  const rows = nodes.map(node => {
    return {
      key: node,
      timeframe,
      snapshotId: snapshot.get('id')
    };
  });

  return (
    <DashboardSection title={`Nodes (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
  );
}

function getRowDetails(row) {
  const snapshotId = row.snapshotId;
  const timeframe = row.timeframe;

  return (
    <TwoColumnRow>
      <div>
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            metrics: ['node_map.' + row.key + '.fd_used', 'node_map.' + row.key + '.fd_total'],
            labels: ['Used file descriptors', 'Total file descriptors'],
            type: 'line'
          }}
        />
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            formatter: bytesZeroDecimalPlaces,
            tooltipFormatter: bytesTwoDecimalPlaces,
            metrics: ['node_map.' + row.key + '.mem_used', 'node_map.' + row.key + '.mem_limit'],
            labels: ['Used memory', 'Memory limit'],
            type: 'line'
          }}
        />
      </div>
      <div>
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            metrics: ['node_map.' + row.key + '.proc_used', 'node_map.' + row.key + '.proc_total'],
            labels: ['Erlang processes in use', 'Maximum number of Erlang processes'],
            type: 'line'
          }}
        />

        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            formatter: bytesZeroDecimalPlaces,
            tooltipFormatter: bytesTwoDecimalPlaces,
            metrics: ['node_map.' + row.key + '.disk_free', 'node_map.' + row.key + '.disk_free_limit'],
            labels: ['Disk alarm threshold', 'Disk free space in bytes'],
            type: 'line'
          }}
        />
      </div>
    </TwoColumnRow>
  );
}
