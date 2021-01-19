/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

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

export default function CacheManagersTable({ snapshot, timeConfig }) {
  const caches = snapshot.getIn(['data', 'cache_managers'], emptyList).toArray();

  if (caches.size === 0) {
    return null;
  }

  const rows = caches.map(cache => {
    return {
      key: cache,
      timeConfig,
      snapshotId: snapshot.get('id')
    };
  });

  return (
    <Table withoutPadding cardTitle="Cache Manager Caches" cols={cols} rows={rows} getRowDetails={getRowDetails} />
  );
}

function getRowDetails(row) {
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
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
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
