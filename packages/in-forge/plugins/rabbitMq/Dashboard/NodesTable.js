import React from 'react';

import { bytesZeroDecimalPlaces, bytesTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
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
  },
  {
    title: 'Used file descriptors',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `node_map.${row.key}.fd_used`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Used memory',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `node_map.${row.key}.mem_used`;
      },
      getContent: bytesZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Used Erlang processes',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `node_map.${row.key}.proc_used`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Disk alarm threshold',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `node_map.${row.key}.disk_free_limit`;
      },
      getContent: bytesZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Disk free',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `node_map.${row.key}.disk_free`;
      },
      getContent: bytesZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function NodesTable({ snapshot, timeConfig }) {
  const nodes = snapshot
    .getIn(['data', 'nodes'], emptyList)
    .toArray()
    .sort();
  if (nodes.length === 0) {
    return null;
  }

  const rows = nodes.map(node => {
    return {
      key: node,
      timeConfig,
      snapshotId: snapshot.get('id')
    };
  });

  return (
    <Table withoutPadding cardTitle={`Nodes (${rows.length})`} cols={cols} rows={rows} getRowDetails={getRowDetails} />
  );
}

function getRowDetails(row) {
  const snapshotId = row.snapshotId;
  const timeConfig = row.timeConfig;

  return (
    <Columize>
      <div>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['node_map.' + row.key + '.fd_used', 'node_map.' + row.key + '.fd_total'],
            labels: ['Used file descriptors', 'Total file descriptors'],
            type: 'line'
          }}
        />
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
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
          timeConfig={timeConfig}
          y1={{
            metrics: ['node_map.' + row.key + '.proc_used', 'node_map.' + row.key + '.proc_total'],
            labels: ['Erlang processes in use', 'Max Erlang processes'],
            type: 'line'
          }}
        />

        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: bytesZeroDecimalPlaces,
            tooltipFormatter: bytesTwoDecimalPlaces,
            metrics: ['node_map.' + row.key + '.disk_free', 'node_map.' + row.key + '.disk_free_limit'],
            labels: ['Disk alarm threshold', 'Disk free space'],
            type: 'line'
          }}
        />
      </div>
    </Columize>
  );
}
