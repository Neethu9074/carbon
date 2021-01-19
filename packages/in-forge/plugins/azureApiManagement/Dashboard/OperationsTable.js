/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { zeroDecimalPlaces, bytesTwoDecimalPlaces, millis } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { emptyMap, emptyList } from 'in-services/fixedImmutables';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.operation.get('displayName');
      }
    }
  },
  {
    title: 'API',
    type: 'string',
    typeArgs: {
      getValue(row) {
        var apiDisplayName = row.api.get('displayName');
        var apiVersion = row.api.get('apiVersion');

        if (apiVersion) {
          apiDisplayName += ' (' + apiVersion + ')';
        }

        return apiDisplayName;
      }
    }
  },
  {
    title: 'Calls',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `metrics.operations.${row.key}.callCountTotal`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'max';
      }
    }
  },
  {
    title: 'Bandwidth',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `metrics.operations.${row.key}.bandwidth`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'max';
      }
    }
  },
  {
    title: 'API response time',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `metrics.operations.${row.key}.apiTimeAvg`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'max';
      }
    }
  },

  {
    title: 'Service response time',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `metrics.operations.${row.key}.serviceTimeAvg`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'max';
      }
    }
  }
];

export default function OperationsTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  var rows = emptyList;

  snapshot.getIn(['data', 'apis'], emptyMap).map(api => {
    api.getIn(['operations'], emptyMap).forEach(operation => {
      const key = api.get('name') + '.' + operation.get('name');
      rows = rows.push({
        key,
        api,
        operation,
        timeConfig,
        snapshotId
      });
    });
  });

  if (rows.count() === 0) {
    return null;
  }

  return (
    <Table
      withoutPadding
      cardTitle={`Operations (${rows.size})`}
      cols={cols}
      rows={rows.toArray()}
      getRowDetails={getRowDetails}
    />
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
            'metrics.operations.' + row.key + '.callCountTotal',
            'metrics.operations.' + row.key + '.callCountSuccess',
            'metrics.operations.' + row.key + '.callCountBlocked',
            'metrics.operations.' + row.key + '.callCountFailed',
            'metrics.operations.' + row.key + '.callCountOther'
          ],
          labels: ['Total Calls', 'Successful Calls', 'Blocked Calls', 'Failed Calls', 'Other Calls'],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />

      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: bytesTwoDecimalPlaces,
          metrics: ['metrics.operations.' + row.key + '.bandwidth'],
          labels: ['Bandwidth'],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />

      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: [
            'metrics.operations.' + row.key + '.cacheHitCount',
            'metrics.operations.' + row.key + '.cacheMissCount'
          ],
          labels: ['Cache Hits', 'Cache Misses'],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Columize>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: millis.detailed,
            metrics: [
              'metrics.operations.' + row.key + '.apiTimeAvg',
              'metrics.operations.' + row.key + '.apiTimeMin',
              'metrics.operations.' + row.key + '.apiTimeMax'
            ],
            labels: ['API Average Response Time', 'API Minimum Response Time', 'API Maximum Response Time'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />

        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: millis.detailed,
            metrics: [
              'metrics.operations.' + row.key + '.serviceTimeAvg',
              'metrics.operations.' + row.key + '.serviceTimeMin',
              'metrics.operations.' + row.key + '.serviceTimeMax'
            ],
            labels: ['Service Average Response Time', 'Service Minimum Response Time', 'Service Maximum Response Time'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </Columize>
    </div>
  );
}
