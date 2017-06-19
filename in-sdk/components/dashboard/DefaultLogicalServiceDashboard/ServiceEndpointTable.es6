import React from 'react';

import JumpToTracesTouchingServiceEndpointButton from 'in-sdk/components/sidebar/JumpToTracesTouchingServiceEndpointButton';
import {
  percentageTwoDecimalPlaces,
  twoDecimalPlaces,
  msZeroDecimalPlaces,
  msTwoDecimalPlaces,
  zeroDecimalPlaces
} from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Calls',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `endpoint.${row.key}.count`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'adjustedCount';
      }
    }
  },
  {
    title: 'Latency',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `endpoint.${row.key}.duration.mean`;
      },
      getContent: msTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Error Rate',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `endpoint.${row.key}.error_rate`;
      },
      getContent: percentageTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Traces',
    type: 'custom',
    disableSorting: true,
    typeArgs: {
      comparator: () => 0,
      get(row) {
        return {
          value: row.key,
          content: <JumpToTracesTouchingServiceEndpointButton snapshotId={row.snapshotId} label={row.key} />
        };
      }
    }
  }
];

export default function ServiceEndpointTable({ snapshot, timeframe }) {
  const rows = snapshot.getIn(['data', 'service_endpoints'], emptyList).toArray().map(endpointName => {
    return {
      key: endpointName,
      snapshotId: snapshot.get('id'),
      timeframe: timeframe
    };
  });

  if (rows.length === 0) {
    return null;
  }

  return (
    <DashboardSection title={`Endpoints (${rows.length})`}>
      <Table
        cols={cols}
        rows={rows}
        getRowDetails={getRowDetails}
        noDataText="No endpoints defined for this service."
      />
    </DashboardSection>
  );
}

function getRowDetails(row) {
  const snapshotId = row.snapshotId;
  const timeframe = row.timeframe;
  const endpointLabel = row.key;

  return (
    <div>
      <ChartWithLegend
        snapshotId={snapshotId}
        timeframe={timeframe}
        margins={{
          left: 80,
          right: 80
        }}
        y1={{
          min: 0,
          formatter: twoDecimalPlaces,
          metrics: [`endpoint.${endpointLabel}.count`],
          labels: ['calls/s'],
          type: 'line'
        }}
        y2={{
          min: 0,
          formatter: msTwoDecimalPlaces,
          metrics: [`endpoint.${endpointLabel}.duration.mean`],
          labels: ['average latency'],
          type: 'line'
        }}
      />

      <ChartWithLegend
        snapshotId={snapshotId}
        timeframe={timeframe}
        height={200}
        margins={{
          left: 80
        }}
        y1={{
          min: 0,
          formatter: msZeroDecimalPlaces,
          metrics: [
            `endpoint.${endpointLabel}.duration.min`,
            `endpoint.${endpointLabel}.duration.25th`,
            `endpoint.${endpointLabel}.duration.50th`,
            `endpoint.${endpointLabel}.duration.75th`,
            `endpoint.${endpointLabel}.duration.95th`,
            `endpoint.${endpointLabel}.duration.98th`,
            `endpoint.${endpointLabel}.duration.99th`,
            `endpoint.${endpointLabel}.duration.max`
          ],
          labels: ['min', '25th', '50th', '75th', '95th', '98th', '99th', 'max'],
          type: 'integral'
        }}
      />

      <ChartWithLegend
        snapshotId={snapshotId}
        timeframe={timeframe}
        margins={{
          left: 80
        }}
        y1={{
          min: 0,
          formatter: percentageTwoDecimalPlaces,
          metrics: [`endpoint.${endpointLabel}.error_rate`],
          labels: ['error rate'],
          type: 'line'
        }}
      />
    </div>
  );
}
