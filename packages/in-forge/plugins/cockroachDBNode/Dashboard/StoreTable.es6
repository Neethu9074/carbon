import { Range } from 'immutable';
import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { bytesZeroDecimalPlaces, zeroDecimalPlaces, zeroDecimalPlacesPerSecond } from 'in-services/formatters/number';
import Table from 'in-components/Table';
import Chart from 'in-components/Chart';
import Columize from 'in-sdk/components/dashboard/Columize';

const cols = [
  {
    title: 'Store Id',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `storeStatuses.${row.storeNum}.storeId`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'max';
      }
    }
  },
  {
    title: 'Capacity',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `storeStatuses.${row.storeNum}.capacity`;
      },
      getContent: bytesZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Available',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `storeStatuses.${row.storeNum}.available`;
      },
      getContent: bytesZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Used',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `storeStatuses.${row.storeNum}.used`;
      },
      getContent: bytesZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Queries/s',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `storeStatuses.${row.storeNum}.queriesPerSecond`;
      },
      getContent: zeroDecimalPlacesPerSecond,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Writes/s',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `storeStatuses.${row.storeNum}.writesPerSecond`;
      },
      getContent: zeroDecimalPlacesPerSecond,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function StoreTable({ snapshot, timeConfig }) {
  const storeCount = snapshot.getIn(['data', 'store_count'], 1);

  const rows = Range(0, storeCount)
    .toArray()
    .map(storeNum => {
      return {
        key: String(storeNum),
        storeNum,
        timeConfig,
        snapshotId: snapshot.get('id')
      };
    });

  return (
    <DashboardSection title="Store stats">
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
  );
}

function getRowDetails(row) {
  return (
    <Columize>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          formatter: bytesZeroDecimalPlaces,
          metrics: [
            'storeStatuses.' + row.storeNum + '.capacity',
            'storeStatuses.' + row.storeNum + '.available',
            'storeStatuses.' + row.storeNum + '.used'
          ],
          labels: ['Capacity', 'Available', 'Used'],
          type: 'line'
        }}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          formatter: zeroDecimalPlacesPerSecond,
          metrics: [
            'storeStatuses.' + row.storeNum + '.queriesPerSecond',
            'storeStatuses.' + row.storeNum + '.writesPerSecond'
          ],
          labels: ['Queries', 'Writes'],
          type: 'line'
        }}
      />
    </Columize>
  );
}
