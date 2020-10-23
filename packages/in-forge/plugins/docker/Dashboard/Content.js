import React from 'react';

import {
  bytesTwoDecimalPlaces,
  timeByNanoTwoDecimalPlaces,
  percentageZeroDecimalPlaces,
  percentageTwoDecimalPlaces
} from 'in-services/formatters/number';
import { hasNetworkMetrics, hasMemoryMetrics } from 'in-forge/plugins/docker/util';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import MetricValue from 'in-components/MetricValue';

export default function DockerDashboard({ snapshot, timeConfig }) {
  const memoryLimitBytes = snapshot.getIn(['data', 'memory.limit']);
  const snapshotId = snapshot.get('id');

  return (
    <div>
      {!hasMemoryMetrics(snapshot) ? (
        <DashboardNotification type="info">
          Due to a regression in Docker 1.11.0 and 1.11.1, no memory metrics can be collected. This has been fixed by
          Docker in 1.12.0 and 1.11.2.
        </DashboardNotification>
      ) : null}

      <KpiSection>
        <KpiKeyValue label="CPU Total %">
          <MetricValue snapshotId={snapshotId} metric="cpu.total_usage" formatter={percentageZeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label="Memory Usage %">
          <MetricValue
            snapshotId={snapshotId}
            metric="memory.used_percentage"
            formatter={percentageZeroDecimalPlaces}
          />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title="CPU">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['cpu.total_usage', 'cpu.system_usage', 'cpu.user_usage'],
            labels: ['Total', 'Kernel', 'User'],
            formatter: percentageTwoDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['cpu.throttling_count'],
            labels: ['Throttling count'],
            type: 'line'
          }}
          y2={{
            min: 0,
            metrics: ['cpu.throttling_time'],
            labels: ['Throttling time'],
            type: 'line',
            formatter: timeByNanoTwoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      {hasMemoryMetrics(snapshot) ? (
        <DashboardSection
          title={`Memory ${memoryLimitBytes ? '(Limit: ' + bytesTwoDecimalPlaces(memoryLimitBytes) + ')' : ''}`}
        >
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['memory.usage', 'memory.total_rss', 'memory.total_cache'],
              labels: ['Usage', 'RSS', 'Cache'],
              formatter: bytesTwoDecimalPlaces,
              type: 'line'
            }}
            y2={{
              min: 0,
              metrics: ['memory.used_percentage'],
              labels: ['Memory usage'],
              type: 'line',
              formatter: percentageTwoDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['memory.active_anon', 'memory.active_file', 'memory.inactive_anon', 'memory.inactive_file'],
              labels: ['Active anonymous', 'Active cache', 'Inactive anonymous', 'Inactive cache'],
              formatter: bytesTwoDecimalPlaces,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      ) : null}

      <DashboardSection title="Block IO">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['blkio.blk_read', 'blkio.blk_write'],
            labels: ['Read', 'Write'],
            type: 'line',
            formatter: bytesTwoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      {hasNetworkMetrics(snapshot) ? (
        <DashboardSection title="Network">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: bytesTwoDecimalPlaces,
              metrics: ['network.rx.bytes', 'network.tx.bytes'],
              labels: ['Received', 'Transmitted'],
              type: 'line'
            }}
            y2={{
              min: 0,
              max: 1,
              metrics: ['network.rx.errors', 'network.rx.dropped', 'network.tx.errors', 'network.tx.dropped'],
              labels: ['RX Errors', 'RX Dropped', 'TX Errors', 'TX Dropped'],
              formatter: percentageTwoDecimalPlaces,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      ) : null}
    </div>
  );
}
