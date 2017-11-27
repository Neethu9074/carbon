import React from 'react';

import { number, percentage, bytes, millis } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';

export default function AwsRdsDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title="CPU Usage">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            metrics: ['cpu_utilization'],
            labels: ['CPU Utilization'],
            formatter: percentage.detailed,
            type: 'line'
          }}
          y2={{
            metrics: ['cpu_credit_usage', 'cpu_credit_balance'],
            labels: ['CPU Credit Usage', 'CPU Credit Balance'],
            formatter: number.compact,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Disk">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            metrics: ['disk_queue_depth'],
            labels: ['Disk queue depth'],
            formatter: number.detailed,
            type: 'line'
          }}
          y2={{
            metrics: ['burst_balance'],
            labels: ['Burst Balance'],
            formatter: percentage.detailed,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="DB Connections">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            metrics: ['db_connections'],
            labels: ['Connections'],
            formatter: number.compact,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Memory">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            metrics: ['freeable_memory', 'free_storage_space', 'swap_usage'],
            labels: ['Freeable RAM', 'Available storage space', 'Swap usage'],
            formatter: bytes.compact,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="IO operations">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            metrics: ['read_iops', 'write_iops'],
            labels: ['Read ops', 'Write ops'],
            formatter: number.perSecond.compact,
            type: 'line'
          }}
          y2={{
            metrics: ['read_latency', 'write_latency'],
            labels: ['Read latency', 'Write latency'],
            formatter: millis.compact,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="IO Throughput">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            metrics: ['read_throughput', 'write_throughput'],
            labels: ['Read throughput', 'Write throughput'],
            formatter: bytes.perSecond.compact,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Network Traffic">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            metrics: ['net_receive_throughput', 'net_transmit_throughput'],
            labels: ['Receive throughput', 'Transmit throughput'],
            formatter: bytes.perSecond.compact,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Read Replica DB">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            metrics: ['replica_lag'],
            labels: ['Replica lag'],
            formatter: millis.compact,
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
