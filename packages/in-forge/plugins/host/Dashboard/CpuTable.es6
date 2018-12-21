import { Range } from 'immutable';
import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { percentage } from 'in-services/formatters/number';
import Table from 'in-components/Table';
import Chart from 'in-components/Chart';

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
      getTimeWindowAggregation() {
        return 'mean';
      }
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
      getTimeWindowAggregation() {
        return 'mean';
      }
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
      getTimeWindowAggregation() {
        return 'mean';
      }
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
      getTimeWindowAggregation() {
        return 'mean';
      }
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
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function CpuTable({ snapshot, timeConfig }) {
  const cpuCount = snapshot.getIn(['data', 'cpu.count'], 1);
  if (cpuCount < 2) {
    return null;
  }

  const rows = Range(1, cpuCount + 1)
    .toArray()
    .map(cpuNumber => {
      return {
        key: String(cpuNumber),
        cpuNumber,
        timeConfig,
        snapshotId: snapshot.get('id')
      };
    });

  // typical CPU counts are 2, 4, 8, 16, 32, 64
  // to have evenly filled pages, we use 8 as maxItems instead of default 10
  return (
    <DashboardSection title="Individual CPU Usage">
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} maxItemsPerPage={8} />
    </DashboardSection>
  );
}

function getRowDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
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
