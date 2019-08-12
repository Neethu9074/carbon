import React from 'react';

import { msZeroDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Datasource JNDI Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
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
        return 'datasources.metrics.' + row.key + '.active';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Available Connections',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'datasources.metrics.' + row.key + '.available';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Connections Currently In Use',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'datasources.metrics.' + row.key + '.inUse';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Time Waited for Exclusive Lock on Pool',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'datasources.metrics.' + row.key + '.blockingTime';
      },
      getContent: msZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function DatasourcesTable({ snapshot, timeConfig }) {
  const datasources = snapshot.getIn(['data', 'datasources.snapshot'], emptyMap);
  if (datasources.size === 0) {
    return null;
  }

  const rows = datasources
    .keySeq()
    .toArray()
    .map(key => {
      const datasource = datasources.get(key);
      return {
        key,
        timeConfig,
        snapshotId: snapshot.get('id'),
        datasource
      };
    });

  return (
    <Table
      cardTitle={`Datasource Connection Pools (${rows.length})`}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
      withoutPadding
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
            'datasources.metrics.' + row.key + '.active',
            'datasources.metrics.' + row.key + '.available',
            'datasources.metrics.' + row.key + '.inUse',
            'datasources.metrics.' + row.key + '.created',
            'datasources.metrics.' + row.key + '.timedOut'
          ],
          labels: ['Active', 'Available', 'In Use', 'Created', 'Timed Out'],
          type: 'line'
        }}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: msZeroDecimalPlaces,
          metrics: [
            'datasources.metrics.' + row.key + '.blockingTime',
            'datasources.metrics.' + row.key + '.creationTime'
          ],
          labels: ['Time Waited for Exclusive Lock on Pool', 'Time Spent on Creating Connections'],
          type: 'line'
        }}
      />
    </div>
  );
}
