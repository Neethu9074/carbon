import React from 'react';

import { activityTwoDecimalPlaces, millis } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import Chart from 'in-components/Chart';

const cols = [
  {
    title: 'Schema',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Queries',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `databases.${row.key}.queries`;
      },
      getContent: activityTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Avg. Query Latency',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `databases.${row.key}.avg_query_latency`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function DatabasesTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'dbs'], emptyList)
    .toArray()
    .map(name => {
      return {
        key: name,
        snapshotId,
        timeConfig
      };
    });

  if (rows.length === 0) {
    return null;
  }

  return (
    <DashboardSection title={`Schemas (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getDetails} />
    </DashboardSection>
  );
}

function getDetails(row) {
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          metrics: ['databases.' + row.key + '.avg_query_latency'],
          labels: ['avg. Query Latency'],
          type: 'line',
          formatter: millis.detailed
        }}
      />
      <Columize>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            formatter: activityTwoDecimalPlaces,
            metrics: ['databases.' + row.key + '.queries'],
            labels: ['Queries'],
            type: 'line'
          }}
        />
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            formatter: activityTwoDecimalPlaces,
            metrics: [
              'databases.' + row.key + '.select_count',
              'databases.' + row.key + '.insert_count',
              'databases.' + row.key + '.update_count',
              'databases.' + row.key + '.delete_count',
              'databases.' + row.key + '.other_count'
            ],
            labels: ['SELECTS', 'INSERTS', 'UPDATES', 'DELETES', 'OTHER'],
            type: 'stackedArea'
          }}
        />
      </Columize>
    </div>
  );
}
