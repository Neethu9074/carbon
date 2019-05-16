import React from 'react';

import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import theme from 'in-themes';

const cols = [
  {
    title: 'Operation',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key.replace(/_/g, ' ');
      }
    }
  },
  {
    title: 'Success',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'storage.' + row.key + '_success';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Fail',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'storage.' + row.key + '_fail';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function OperationsTable({ snapshot, timeConfig }) {
  const ops = ['gets', 'sets', 'create', 'delete', 'update', 'compare_and_swap', 'compare_and_delete'];

  const rows = ops.map(key => {
    return {
      key,
      timeConfig,
      snapshotId: snapshot.get('id')
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={`Operations (${rows.length})`}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row) {
  const snapshotId = row.snapshotId;
  const timeConfig = row.timeConfig;

  return (
    <Chart
      snapshotId={snapshotId}
      timeConfig={timeConfig}
      y1={{
        formatter: zeroDecimalPlaces,
        metrics: ['storage.' + row.key + '_success', 'storage.' + row.key + '_fail'],
        labels: ['Success', 'Fail'],
        type: 'line',
        colors: [theme.lib.colors.green800, theme.lib.colors.red800]
      }}
    />
  );
}
