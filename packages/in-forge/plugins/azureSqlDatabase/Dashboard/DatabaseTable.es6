import React from 'react';

import Table from 'in-sdk/components/dashboard/Table';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { emptyMap } from 'in-services/fixedImmutables';
import Chart from 'in-components/Chart';
import {
  zeroDecimalPlaces,
  number,
  percentagePlainTwoDecimalPlaces,
  bytesTwoDecimalPlaces
} from 'in-services/formatters/number';

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.db.get('name');
      }
    }
  },
  {
    title: 'Location',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.db.get('location');
      }
    }
  },
  {
    title: 'Status',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.db.get('status');
      }
    }
  },
  {
    title: 'SKU',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.db.get('sku');
      }
    }
  },
  {
    title: 'DTU',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `metrics.databases.${row.key}.dtu_consumption_percent`;
      },
      getContent: percentagePlainTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Max Size',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.db.get('maxSizeBytes');
      },
      getContent: bytesTwoDecimalPlaces
    }
  },
  {
    title: 'Database Size (bytes)',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `metrics.databases.${row.key}.storage`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'max';
      }
    }
  },
  {
    title: 'Database Size (%)',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `metrics.databases.${row.key}.storage_percent`;
      },
      getContent: percentagePlainTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'max';
      }
    }
  },
  {
    title: 'CPU',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `metrics.databases.${row.key}.cpu_percent`;
      },
      getContent: percentagePlainTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function DatabaseTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'databases'], emptyMap)
    .map((db, key) => {
      return {
        key,
        db,
        timeConfig,
        snapshotId
      };
    })
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  return (
    <DashboardSection title={`Databases (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
  );
}

function getRowDetails(row) {
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: number.detailed,
          metrics: ['metrics.databases.' + row.key + '.dtu_limit', 'metrics.databases.' + row.key + '.dtu_used'],
          labels: ['DTU Limit', 'DTU Used'],
          type: 'line'
        }}
        y2={{
          formatter: percentagePlainTwoDecimalPlaces,
          metrics: ['metrics.databases.' + row.key + '.dtu_consumption_percent'],
          labels: ['DTU Percentage'],
          type: 'bar'
        }}
      />

      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: [
            'metrics.databases.' + row.key + '.connection_successful',
            'metrics.databases.' + row.key + '.connection_failed'
          ],
          labels: ['Successful Connections', 'Failed Connections'],
          type: 'line'
        }}
      />

      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: ['metrics.databases.' + row.key + '.blocked_by_firewall'],
          labels: ['Blocked by Firewall'],
          type: 'line'
        }}
      />

      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: ['metrics.databases.' + row.key + '.deadlock'],
          labels: ['Deadlocks'],
          type: 'line'
        }}
      />

      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: bytesTwoDecimalPlaces,
          metrics: ['metrics.databases.' + row.key + '.storage'],
          labels: ['Total database size'],
          type: 'line'
        }}
        y2={{
          formatter: percentagePlainTwoDecimalPlaces,
          metrics: ['metrics.databases.' + row.key + '.storage_percent'],
          labels: ['Database size'],
          type: 'bar'
        }}
      />

      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: percentagePlainTwoDecimalPlaces,
          metrics: ['metrics.databases.' + row.key + '.cpu_percent'],
          labels: ['CPU percentage'],
          type: 'line'
        }}
      />

      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: percentagePlainTwoDecimalPlaces,
          metrics: [
            'metrics.databases.' + row.key + '.physical_data_read_percent',
            'metrics.databases.' + row.key + '.log_write_percent',
            'metrics.databases.' + row.key + '.xtp_storage_percent',
            'metrics.databases.' + row.key + '.workers_percent',
            'metrics.databases.' + row.key + '.sessions_percent'
          ],
          labels: ['Data IO', 'Log IO', 'In-Memory OLTP storage', 'Workers', 'Sessions'],
          type: 'line'
        }}
      />
    </div>
  );
}
