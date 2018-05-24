import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-components/Chart';
import Table from 'in-sdk/components/dashboard/Table';

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
    <DashboardSection title={`Operations (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
  );
}

function getRowDetails(row) {
  const snapshotId = row.snapshotId;
  const timeConfig = row.timeConfig;

  return (
    <Columize>
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: ['storage.' + row.key + '_success'],
          labels: ['Success'],
          type: 'line'
        }}
      />

      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: ['storage.' + row.key + '_fail'],
          labels: ['Fail'],
          type: 'line'
        }}
      />
    </Columize>
  );
}
