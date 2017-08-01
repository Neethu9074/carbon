import React from 'react';

import { activityZeroDecimalPlaces, hitRateZeroDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import Chart from 'in-components/Chart';

const cols = [
  {
    title: 'Database',
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
        return 'databases.' + row.key + '.queries';
      },
      getContent: activityZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Committed transactions',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'databases.' + row.key + '.xact_commit';
      },
      getContent: activityZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Rolled back transactions',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'databases.' + row.key + '.xact_rollback';
      },
      getContent: activityZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Cache Hit Ratio',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'databases.' + row.key + '.blks_hit_rate';
      },
      getContent: hitRateZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Standby Conflicts',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'databases.' + row.key + '.conflicts';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Tuple read',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'databases.' + row.key + '.idx_tup_read';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Tuple fetch',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'databases.' + row.key + '.idx_tup_fetch';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function DatabasesTable({ snapshot, timeframe }) {
  const databases = snapshot.getIn(['data', 'dbs'], emptyList).toArray().sort();
  if (databases.size === 0) {
    return null;
  }

  const rows = databases.map(database => {
    return {
      key: database,
      snapshotId: snapshot.get('id'),
      timeframe,
      snapshot
    };
  });

  return (
    <DashboardSection title="Databases">
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
  );
}

function getRowDetails(row) {
  const snapshotId = row.snapshotId;
  const timeframe = row.timeframe;

  return (
    <div>
      <DashboardSection title="Transactions">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 40,
            right: 40
          }}
          y1={{
            min: 0,
            formatter: activityZeroDecimalPlaces,
            metrics: ['databases.' + row.key + '.xact_commit'],
            labels: ['Committed transactions'],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: activityZeroDecimalPlaces,
            metrics: ['databases.' + row.key + '.xact_rollback'],
            labels: ['Rolled back transactions'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Cache">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            max: 1,
            metrics: ['databases.' + row.key + '.blks_hit_rate'],
            labels: ['Cache Hit Ratio'],
            type: 'line',
            formatter: hitRateZeroDecimalPlaces
          }}
        />
      </DashboardSection>
      <DashboardSection title="Conflicts">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            formatter: zeroDecimalPlaces,
            metrics: ['databases.' + row.key + '.conflicts'],
            labels: ['Standby Conflicts'],
            type: 'line'
          }}
        />

      </DashboardSection>
      <DashboardSection title="Tuples">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            formatter: activityZeroDecimalPlaces,
            metrics: ['databases.' + row.key + '.idx_tup_read', 'databases.' + row.key + '.idx_tup_fetch'],
            labels: ['Tuple read', 'Tuple fetch'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
