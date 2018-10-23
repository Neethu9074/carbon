import React from 'react';

import Table from 'in-sdk/components/dashboard/Table';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { emptyMap } from 'in-services/fixedImmutables';
import Chart from 'in-components/Chart';
import Columize from 'in-sdk/components/dashboard/Columize';
import { zeroDecimalPlaces, bytesTwoDecimalPlaces, millis } from 'in-services/formatters/number';

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        var version = row.api.get('apiVersion');

        if (version) {
          return row.api.get('displayName') + ' (' + version + ')';
        } else {
          return row.api.get('displayName');
        }
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
        return `metrics.apis.${row.key}.callCountTotal`;
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
        return `metrics.apis.${row.key}.bandwidth`;
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
        return `metrics.apis.${row.key}.apiTimeAvg`;
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
        return `metrics.apis.${row.key}.serviceTimeAvg`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'max';
      }
    }
  }
];

export default function ApisTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'apis'], emptyMap)
    .map((api, key) => {
      return {
        key,
        api,
        timeConfig,
        snapshotId
      };
    })
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  return (
    <DashboardSection title={`APIs (${rows.length})`}>
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
          formatter: zeroDecimalPlaces,
          metrics: [
            'metrics.apis.' + row.key + '.callCountTotal',
            'metrics.apis.' + row.key + '.callCountSuccess',
            'metrics.apis.' + row.key + '.callCountBlocked',
            'metrics.apis.' + row.key + '.callCountFailed',
            'metrics.apis.' + row.key + '.callCountOther'
          ],
          labels: ['Total Calls', 'Successful Calls', 'Blocked Calls', 'Failed Calls', 'Other Calls'],
          type: 'line'
        }}
      />

      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: bytesTwoDecimalPlaces,
          metrics: ['metrics.apis.' + row.key + '.bandwidth'],
          labels: ['Bandwidth'],
          type: 'line'
        }}
      />

      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: ['metrics.apis.' + row.key + '.cacheHitCount', 'metrics.apis.' + row.key + '.cacheMissCount'],
          labels: ['Cache Hits', 'Cache Misses'],
          type: 'line'
        }}
      />
      <Columize>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: millis.detailed,
            metrics: [
              'metrics.apis.' + row.key + '.apiTimeAvg',
              'metrics.apis.' + row.key + '.apiTimeMin',
              'metrics.apis.' + row.key + '.apiTimeMax'
            ],
            labels: ['API Average Response Time', 'API Minimum Response Time', 'API Maximum Response Time'],
            type: 'line'
          }}
        />

        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: millis.detailed,
            metrics: [
              'metrics.apis.' + row.key + '.serviceTimeAvg',
              'metrics.apis.' + row.key + '.serviceTimeMin',
              'metrics.apis.' + row.key + '.serviceTimeMax'
            ],
            labels: ['Service Average Response Time', 'Service Minimum Response Time', 'Service Maximum Response Time'],
            type: 'line'
          }}
        />
      </Columize>
    </div>
  );
}
