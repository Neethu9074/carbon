import React from 'react';

import { number, millis, hitRateZeroDecimalPlaces } from 'in-services/formatters/number';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';
import { emptyList } from 'in-services/fixedImmutables';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Core',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Requests',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `core_stats.${row.key}.requests`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Request Time',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `core_stats.${row.key}.avg_time_request`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Cache Hit Rate',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `core_stats.${row.key}.hitratio`;
      },
      getContent: hitRateZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Evictions',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `core_stats.${row.key}.evictions`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Errors',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `core_stats.${row.key}.errors`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function CoresTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'core_names'], emptyList)
    .toArray()
    .map(name => {
      return {
        key: name,
        timeConfig,
        snapshotId
      };
    });

  if (rows.length === 0) {
    return null;
  }

  return (
    <DashboardSection title={`Cores (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
  );
}

function getRowDetails(row) {
  return (
    <div>
      <Columize>
        <DashboardSection title="Requests">
          <Chart
            snapshotId={row.snapshotId}
            timeConfig={row.timeConfig}
            y1={{
              min: 0,
              metrics: ['core_stats.' + row.key + '.requests'],
              labels: ['Requests'],
              type: 'line',
              formatter: number.compact
            }}
          />
        </DashboardSection>
        <DashboardSection title="Request Time">
          <Chart
            snapshotId={row.snapshotId}
            timeConfig={row.timeConfig}
            y1={{
              min: 0,
              metrics: ['core_stats.' + row.key + '.avg_time_request'],
              labels: ['Average Request Time'],
              type: 'line',
              formatter: millis.detailed
            }}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title="Cache Lookups">
          <Chart
            snapshotId={row.snapshotId}
            timeConfig={row.timeConfig}
            y1={{
              min: 0,
              metrics: ['core_stats.' + row.key + '.lookups'],
              labels: ['Lookups'],
              type: 'line',
              formatter: number.compact
            }}
          />
        </DashboardSection>
        <DashboardSection title="Cache Hit Rate">
          <Chart
            snapshotId={row.snapshotId}
            timeConfig={row.timeConfig}
            y1={{
              min: 0,
              metrics: ['core_stats.' + row.key + '.hitratio'],
              labels: ['Hit-rate'],
              type: 'line',
              formatter: hitRateZeroDecimalPlaces
            }}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title="Insertions">
          <Chart
            snapshotId={row.snapshotId}
            timeConfig={row.timeConfig}
            y1={{
              min: 0,
              metrics: ['core_stats.' + row.key + '.inserts'],
              labels: ['Inserts'],
              type: 'line',
              formatter: number.compact
            }}
          />
        </DashboardSection>
        <DashboardSection title="Evictions">
          <Chart
            snapshotId={row.snapshotId}
            timeConfig={row.timeConfig}
            y1={{
              min: 0,
              metrics: ['core_stats.' + row.key + '.evictions'],
              labels: ['Evictions'],
              type: 'line',
              formatter: number.compact
            }}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title="Errors">
          <Chart
            snapshotId={row.snapshotId}
            timeConfig={row.timeConfig}
            y1={{
              min: 0,
              metrics: ['core_stats.' + row.key + '.errors'],
              labels: ['Errors'],
              type: 'line',
              formatter: number.compact
            }}
          />
        </DashboardSection>
        <DashboardSection title="Timeouts">
          <Chart
            snapshotId={row.snapshotId}
            timeConfig={row.timeConfig}
            y1={{
              min: 0,
              metrics: ['core_stats.' + row.key + '.timeouts'],
              labels: ['Timeouts'],
              type: 'line',
              formatter: number.compact
            }}
          />
        </DashboardSection>
      </Columize>

      <DashboardSection title="Documents">
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            metrics: ['core_stats.' + row.key + '.docs_added', 'core_stats.' + row.key + '.docs_pending'],
            labels: ['Documents added', 'Documents pending'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
    </div>
  );
}
