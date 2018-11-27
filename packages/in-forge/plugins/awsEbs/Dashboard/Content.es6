import React from 'react';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';
import { bytes, number, percentage, seconds } from 'in-services/formatters/number';

export default function AwsEbsDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DashboardSection title="Read Bytes">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['read_bytes', 'write_bytes'],
            labels: ['Read Bytes', 'Write Bytes'],
            type: 'line',
            formatter: bytes.compact
          }}
        />
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['read_ops', 'write_ops', 'queue_length'],
            labels: ['Read Operations', 'Write Operations', 'Queue Length'],
            type: 'line',
            formatter: number.compact
          }}
        />
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['total_read_time', 'total_write_time', 'idle_time'],
            labels: ['Total Read Time', 'Total Write Time', 'Idle Time'],
            type: 'line',
            formatter: seconds.compact
          }}
        />
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['burst_balance'],
            labels: ['Burst Balance'],
            type: 'line',
            formatter: percentage.compact
          }}
        />
      </DashboardSection>
    </div>
  );
}
