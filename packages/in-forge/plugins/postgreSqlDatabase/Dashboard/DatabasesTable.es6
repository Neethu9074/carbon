import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import {
  activityZeroDecimalPlaces,
  hitRateZeroDecimalPlaces,
  zeroDecimalPlaces,
  bytesTwoDecimalPlaces
} from 'in-services/formatters/number';

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
  },
  {
    title: 'Size',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'databases.' + row.key + '.db_size';
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Active Connections',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'databases.' + row.key + '.active_connections';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function DatabasesTable({ snapshot, timeConfig }) {
  const databases = snapshot
    .getIn(['data', 'dbs'], emptyList)
    .toArray()
    .sort();
  if (databases.size === 0) {
    return null;
  }

  const rows = databases.map(database => {
    return {
      key: database,
      snapshotId: snapshot.get('id'),
      timeConfig,
      snapshot
    };
  });

  return <Table withoutPadding cardTitle="Databases" cols={cols} rows={rows} getRowDetails={getRowDetails} />;
}

function getRowDetails(row) {
  const snapshotId = row.snapshotId;
  const timeConfig = row.timeConfig;

  return (
    <div>
      <DashboardSection title="Transactions">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
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
          timeConfig={timeConfig}
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
          timeConfig={timeConfig}
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
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: activityZeroDecimalPlaces,
            metrics: ['databases.' + row.key + '.idx_tup_read', 'databases.' + row.key + '.idx_tup_fetch'],
            labels: ['Tuple read', 'Tuple fetch'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Database Size">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytesTwoDecimalPlaces,
            metrics: ['databases.' + row.key + '.db_size'],
            labels: ['Size'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Connections">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: zeroDecimalPlaces,
            metrics: ['databases.' + row.key + '.active_connections'],
            labels: ['Active'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
