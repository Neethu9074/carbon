import React from 'react';

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Table from 'in-sdk/components/dashboard/Table';
import Chart from 'in-components/Chart';
import { emptyList } from 'in-services/fixedImmutables';

const cols = [
  {
    title: 'Cache Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      },
      getContent(value) {
        return value;
      }
    }
  },
  {
    title: 'Defined caches',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `cacheManagers.${row.key}.defined_caches`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Created caches',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `cacheManagers.${row.key}.created_caches`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Running caches',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `cacheManagers.${row.key}.running_caches`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function CacheManagersTable({ snapshot, timeframe }) {
  const caches = snapshot.getIn(['data', 'cache_managers'], emptyList).toArray();

  if (caches.size === 0) {
    return null;
  }

  const rows = caches.map(cache => {
    return {
      key: cache,
      timeframe,
      snapshotId: snapshot.get('id')
    };
  });

  return (
    <DashboardSection title="Cache Manager Caches">
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
  );
}

function getRowDetails(row) {
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeframe={row.timeframe}
        margins={{
          left: 80
        }}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: [
            'cacheManagers.' + row.key + '.defined_caches',
            'cacheManagers.' + row.key + '.created_caches',
            'cacheManagers.' + row.key + '.running_caches'
          ],
          labels: ['Defined', 'Created', 'Running'],
          type: 'line'
        }}
      />
    </div>
  );
}
