import React from 'react';

import { zeroDecimalPlaces, bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart'
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Error received',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'doppler.error_received';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Dropped messages',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'doppler.total_dropped_msg';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Allocated',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'doppler.bytes_allocated';
      },
      getContent: bytesZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Allocated Heap',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'doppler.bytes_allocated_heap';
      },
      getContent: bytesZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Allocated Stack',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'doppler.bytes_allocated_stack';
      },
      getContent: bytesZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function DopplerTable({ snapshot, timeframe }) {
  const dopplerComponents = [''];

  const rows = dopplerComponents.map(component => {
    return {
      key: component,
      snapshotId: snapshot.get('id'),
      timeframe
    };
  });

  return (
    <DashboardSection title={`Doppler (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
  );
}

function getRowDetails(row) {
  const snapshotId = row.snapshotId;
  return (
    <div>
      <DashboardSection title="Statistics">
        <Chart
          snapshotId={snapshotId}
          timeframe={row.timeframe}
          margins={{
            left: 60
          }}
          y1={{
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces,
            metrics: ['doppler.error_received', 'doppler.total_dropped_msg'],
            labels: ['Error received', 'Dropped messages'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Memory">
        <Chart
          snapshotId={snapshotId}
          timeframe={row.timeframe}
          margins={{
            left: 60
          }}
          y1={{
            formatter: bytesZeroDecimalPlaces,
            tooltipFormatter: bytesZeroDecimalPlaces,
            metrics: ['doppler.bytes_allocated', 'doppler.bytes_allocated_heap', 'doppler.bytes_allocated_stack'],
            labels: ['Allocated', 'Allocated Heap', 'Allocated Stack'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
