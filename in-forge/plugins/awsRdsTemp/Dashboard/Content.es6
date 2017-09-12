import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { zeroDecimalPlaces, percentageTwoDecimalPlaces, bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-components/Chart';

const ioOpsFormatter = d => zeroDecimalPlaces(d) + ' ops/s';
const ioOpsLatencyFormatter = d => zeroDecimalPlaces(d) + 's';
const ioThroughputFormatter = d => bytesZeroDecimalPlaces(d) + '/s';

export default function AwsRdsDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>

      <DashboardSection title="CPU Usage">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 60,
            right: 30
          }}
          y1={{
            metrics: ['cpu_utilization'],
            labels: ['CPU Utilization'],
            formatter: percentageTwoDecimalPlaces,
            type: 'line'
          }}
          y2={{
            metrics: ['cpu_credit_usage', 'cpu_credit_balance'],
            labels: ['CPU Credit Usage', 'CPU Credit Balance'],
            formatter: zeroDecimalPlaces,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Disk">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 30,
            right: 60
          }}
          y1={{
            metrics: ['disk_queue_depth'],
            labels: ['Disk queue depth'],
            formatter: zeroDecimalPlaces,
            type: 'line'
          }}
          y2={{
            metrics: ['burst_balance'],
            labels: ['Burst Balance'],
            formatter: percentageTwoDecimalPlaces,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="DB Connections">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 30
          }}
          y1={{
            metrics: ['db_connections'],
            labels: ['Connections'],
            formatter: zeroDecimalPlaces,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Memory">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 40
          }}
          y1={{
            metrics: ['freeable_memory', 'free_storage_space', 'swap_usage'],
            labels: ['Freeable RAM', 'Available storage space', 'Swap usage'],
            formatter: bytesZeroDecimalPlaces,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="IO operations">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 50,
            right: 30
          }}
          y1={{
            metrics: ['read_iops', 'write_iops'],
            labels: ['Read ops', 'Write ops'],
            formatter: ioOpsFormatter,
            type: 'line'
          }}
          y2={{
            metrics: ['read_latency', 'write_latency'],
            labels: ['Read latency', 'Write latency'],
            formatter: ioOpsLatencyFormatter,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="IO Throughput">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 40
          }}
          y1={{
            metrics: ['read_throughput', 'write_throughput'],
            labels: ['Read throughput', 'Write throughput'],
            formatter: ioThroughputFormatter,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Network Traffic">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 40
          }}
          y1={{
            metrics: ['net_receive_throughput', 'net_transmit_throughput'],
            labels: ['Receive throughput', 'Transmit throughput'],
            formatter: ioThroughputFormatter,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Read Replica DB">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 40
          }}
          y1={{
            metrics: ['replica_lag'],
            labels: ['Replica lag'],
            formatter: zeroDecimalPlaces,
            type: 'line'
          }}
        />
      </DashboardSection>

    </div>
  );
}
