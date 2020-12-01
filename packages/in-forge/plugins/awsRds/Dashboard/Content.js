import React from 'react';

import GetMetricStatisticsInUse from 'in-forge/plugins/awsDynamoDb/GetMetricStatisticsInUse';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { number, percentage, bytes, millis } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Button from 'in-new-components/Button';

export default function AwsRdsDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <GetMetricStatisticsInUse snapshot={snapshot} />
      <DashboardSection title="CPU Usage">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
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
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Disk">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
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
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['free_storage_space'],
            labels: ['Available storage space'],
            formatter: bytes.detailed,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="DB Connections">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['db_connections'],
            labels: ['Connections'],
            formatter: number.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Memory">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['freeable_memory', 'swap_usage'],
            labels: ['Freeable RAM', 'Swap usage'],
            formatter: bytes.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="IO operations">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
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
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="IO Throughput">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['read_throughput', 'write_throughput'],
            labels: ['Read throughput', 'Write throughput'],
            formatter: bytes.perSecond.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Network Traffic">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['net_receive_throughput', 'net_transmit_throughput'],
            labels: ['Receive throughput', 'Transmit throughput'],
            formatter: bytes.perSecond.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Read Replica DB">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['replica_lag'],
            labels: ['Replica lag'],
            formatter: millis.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      {snapshot.getIn(['data', 'db_engine']) === 'aurora' && (
        <DashboardSection title="Volume Bytes Used">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['volume_bytes_used_avg'],
              labels: ['Volume Bytes Used'],
              type: 'line',
              formatter: bytes.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}
      <DashboardNotification>
        Looking for even deeper database insights? Check out our integration with{' '}
        <Button
          href="https://www.dbmarlin.com/instana-offer?utm_campaign=Instana&utm_source=Instana&utm_medium=Instana"
          target="_blank"
        >
          DBmarlin
        </Button>
      </DashboardNotification>
    </div>
  );
}
