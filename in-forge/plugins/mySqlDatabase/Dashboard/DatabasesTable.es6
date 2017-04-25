import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import { emptyList } from 'in-services/fixedImmutables';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';
import Table from 'in-sdk/components/dashboard/Table';

import { zeroDecimalPlaces, msZeroDecimalPlaces } from 'in-services/formatters/number';

const queriesFormatter = d => (d < 0 ? 'No activity' : zeroDecimalPlaces(d));

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
      getContent: queriesFormatter,
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
      getContent: msZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function DatabasesTable({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot.getIn(['data', 'dbs'], emptyList).toArray().map(name => {
    return {
      key: name,
      snapshotId,
      timeframe
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
      <ChartWithLegend
        snapshotId={row.snapshotId}
        timeframe={row.timeframe}
        margins={{
          left: 80
        }}
        y1={{
          min: 0,
          metrics: ['databases.' + row.key + '.avg_query_latency'],
          labels: ['avg. Query Latency'],
          type: 'line',
          formatter: msZeroDecimalPlaces
        }}
      />
      <TwoColumnRow>
        <ChartWithLegend
          snapshotId={row.snapshotId}
          timeframe={row.timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            formatter: queriesFormatter,
            metrics: ['databases.' + row.key + '.queries'],
            labels: ['Queries'],
            type: 'line'
          }}
        />
        <ChartWithLegend
          snapshotId={row.snapshotId}
          timeframe={row.timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            formatter: queriesFormatter,
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
      </TwoColumnRow>
    </div>
  );
}
