import { Range } from 'immutable';
import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import { percentage } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'CPU',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.cpuNumber;
      },
      getContent(cpuNumber) {
        return `CPU ${cpuNumber}`;
      }
    }
  },
  {
    title: 'User',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `cpus.${row.cpuNumber}.user`;
      },
      getContent: percentage.compact,
      timeWindowAggregation: 'mean'
    }
  },
  {
    title: 'System',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `cpus.${row.cpuNumber}.sys`;
      },
      getContent: percentage.compact,
      timeWindowAggregation: 'mean'
    }
  },
  {
    title: 'Wait',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `cpus.${row.cpuNumber}.wait`;
      },
      getContent: percentage.compact,
      timeWindowAggregation: 'mean'
    }
  },
  {
    title: 'Nice',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `cpus.${row.cpuNumber}.nice`;
      },
      getContent: percentage.compact,
      timeWindowAggregation: 'mean'
    }
  },
  {
    title: 'Steal',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `cpus.${row.cpuNumber}.steal`;
      },
      getContent: percentage.compact,
      timeWindowAggregation: 'mean'
    }
  }
];

export default function CpuTable({ snapshot, timeframe }) {
  const cpuCount = snapshot.getIn(['data', 'cpu.count'], 1);
  if (cpuCount < 2) {
    return null;
  }

  const rows = Range(1, cpuCount + 1).toArray().map(cpuNumber => {
    return {
      key: String(cpuNumber),
      cpuNumber,
      timeframe,
      snapshotId: snapshot.get('id')
    };
  });

  return (
    <DashboardSection title="Individual CPU Usage">
      <Table cols={cols} rows={rows} getRowDetails={getDetails} />
    </DashboardSection>
  );
}

function getDetails(row) {
  return (
    <ChartWithLegend
      snapshotId={row.snapshotId}
      timeframe={row.timeframe}
      margins={{
        left: 60
      }}
      y1={{
        min: 0,
        max: 1,
        formatter: percentage.compact,
        metrics: [
          'cpus.' + row.cpuNumber + '.user',
          'cpus.' + row.cpuNumber + '.sys',
          'cpus.' + row.cpuNumber + '.wait',
          'cpus.' + row.cpuNumber + '.nice',
          'cpus.' + row.cpuNumber + '.steal'
        ],
        labels: ['User', 'System', 'Wait', 'Nice', 'Steal'],
        type: 'stackedArea'
      }}
    />
  );
}
