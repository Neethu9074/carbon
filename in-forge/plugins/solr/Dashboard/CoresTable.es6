import React from 'react';

import {
  zeroDecimalPlaces,
  twoDecimalPlaces,
  percentageZeroDecimalPlaces,
  msZeroDecimalPlaces,
  number,
  millis,
  percentage
} from 'in-services/formatters/number';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';
import { emptyList } from 'in-services/fixedImmutables';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';
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
        return `core_stats.${row.key}.avg_requests`;
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
      getContent: millis.compact,
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
      getContent: percentage.compact,
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

export default function CoresTable({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot.getIn(['data', 'core_names'], emptyList).toArray().map(name => {
    return {
      key: name,
      timeframe,
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
      <TwoColumnRow>
        <DashboardSection title="Requests">
          <Chart
            snapshotId={row.snapshotId}
            timeframe={row.timeframe}
            margins={{
              left: 80
            }}
            y1={{
              min: 0,
              metrics: ['core_stats.' + row.key + '.avg_requests'],
              labels: ['Average Requests'],
              type: 'line',
              formatter: zeroDecimalPlaces
            }}
          />
        </DashboardSection>
        <DashboardSection title="Request Time">
          <Chart
            snapshotId={row.snapshotId}
            timeframe={row.timeframe}
            margins={{
              left: 80
            }}
            y1={{
              min: 0,
              metrics: ['core_stats.' + row.key + '.avg_time_request'],
              labels: ['Average Request Time'],
              type: 'line',
              formatter: msZeroDecimalPlaces
            }}
          />
        </DashboardSection>
      </TwoColumnRow>

      <TwoColumnRow>
        <DashboardSection title="Cache Lookups">
          <Chart
            snapshotId={row.snapshotId}
            timeframe={row.timeframe}
            margins={{
              left: 80
            }}
            y1={{
              min: 0,
              metrics: ['core_stats.' + row.key + '.lookups'],
              labels: ['Lookups'],
              type: 'line',
              formatter: twoDecimalPlaces
            }}
          />
        </DashboardSection>
        <DashboardSection title="Cache Hit Rate">
          <Chart
            snapshotId={row.snapshotId}
            timeframe={row.timeframe}
            margins={{
              left: 80
            }}
            y1={{
              min: 0,
              metrics: ['core_stats.' + row.key + '.hitratio'],
              labels: ['Hit-rate'],
              type: 'line',
              formatter: percentageZeroDecimalPlaces
            }}
          />
        </DashboardSection>
      </TwoColumnRow>

      <TwoColumnRow>
        <DashboardSection title="Insertions">
          <Chart
            snapshotId={row.snapshotId}
            timeframe={row.timeframe}
            margins={{
              left: 80
            }}
            y1={{
              min: 0,
              metrics: ['core_stats.' + row.key + '.inserts'],
              labels: ['Inserts'],
              type: 'line',
              formatter: zeroDecimalPlaces
            }}
          />
        </DashboardSection>
        <DashboardSection title="Evictions">
          <Chart
            snapshotId={row.snapshotId}
            timeframe={row.timeframe}
            margins={{
              left: 80
            }}
            y1={{
              min: 0,
              metrics: ['core_stats.' + row.key + '.evictions'],
              labels: ['Evictions'],
              type: 'line',
              formatter: zeroDecimalPlaces
            }}
          />
        </DashboardSection>
      </TwoColumnRow>

      <TwoColumnRow>
        <DashboardSection title="Errors">
          <Chart
            snapshotId={row.snapshotId}
            timeframe={row.timeframe}
            margins={{
              left: 80
            }}
            y1={{
              min: 0,
              metrics: ['core_stats.' + row.key + '.errors'],
              labels: ['Errors'],
              type: 'line',
              formatter: zeroDecimalPlaces
            }}
          />
        </DashboardSection>
        <DashboardSection title="Timeouts">
          <Chart
            snapshotId={row.snapshotId}
            timeframe={row.timeframe}
            margins={{
              left: 80
            }}
            y1={{
              min: 0,
              metrics: ['core_stats.' + row.key + '.timeouts'],
              labels: ['Timeouts'],
              type: 'line',
              formatter: zeroDecimalPlaces
            }}
          />
        </DashboardSection>
      </TwoColumnRow>

      <DashboardSection title="Documents">
        <Chart
          snapshotId={row.snapshotId}
          timeframe={row.timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            metrics: ['core_stats.' + row.key + '.docs_added', 'core_stats.' + row.key + '.docs_pending'],
            labels: ['Documents added', 'Documents pending'],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>
    </div>
  );
}
