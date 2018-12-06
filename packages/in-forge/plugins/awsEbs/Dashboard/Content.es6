import React from 'react';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';
import { bytes, number, percentage, seconds } from 'in-services/formatters/number';

export default function AwsEbsDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DashboardSection title="Bytes">
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
      </DashboardSection>
      <DashboardSection title="Operations">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['read_ops', 'write_ops'],
            labels: ['Read Operations', 'Write Operations'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title="Time">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['total_read_time', 'total_write_time'],
            labels: ['Total Read Time', 'Total Write Time'],
            type: 'line',
            formatter: seconds.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title="Idle">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['idle_time'],
            labels: ['Idle Time'],
            type: 'line',
            formatter: seconds.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title="Queue">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['queue_length'],
            labels: ['Queue Length'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      {snapshot.getIn(['data', 'type']) !== 'io1' && (
        <DashboardSection title="Burst">
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
      )}
    </div>
  );
}
