import React from 'react';

import {
  bytesTwoDecimalPlaces,
  timeByMicroTwoDecimalPlaces,
  percentageZeroDecimalPlaces,
  percentageTwoDecimalPlaces
} from 'in-services/formatters/number';
import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import DashboardNotification from 'in-components/DashboardNotification';
import ChartWithLegend from 'in-components/ChartWithLegend';
import MetricValue from 'in-components/MetricValue';
import { getLabel } from 'in-sdk/snapshot';

export default function DockerDashboard({ snapshot, timeframe }) {
  const dockerVersion = snapshot.getIn(['data', 'docker_version']);
  const hasNetworkMetrics = snapshot.getIn(['data', 'NetworkMode'], '') === 'bridge';
  const memoryMetricsBugged = dockerVersion === '1.11.0' || dockerVersion === '1.11.1';
  const memoryLimitBytes = snapshot.getIn(['data', 'memory.limit']);
  const snapshotId = snapshot.get('id');

  return (
    <div>
      {memoryMetricsBugged
        ? <DashboardNotification type="info">
            Due to a regression in Docker 1.11.0 and 1.11.1, no memory metrics can be collected.
            This has been fixed by Docker in 1.12.0 and 1.11.2.
          </DashboardNotification>
        : null}

      <KpiSection>
        <KpiHeading>
          {getLabel(snapshot)}
        </KpiHeading>
        <KpiKeyValue label="CPU Total %">
          <MetricValue snapshotId={snapshotId} metric="cpu.total_usage" formatter={percentageZeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label="Memory Usage">
          <MetricValue snapshotId={snapshotId} metric="memory.usage" formatter={bytesTwoDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title="CPU">
        <ChartWithLegend
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80,
            right: 10
          }}
          y1={{
            min: 0,
            metrics: ['cpu.total_usage', 'cpu.system_usage', 'cpu.user_usage'],
            labels: ['Total', 'Kernel', 'User'],
            formatter: percentageTwoDecimalPlaces,
            type: 'line'
          }}
        />
        <ChartWithLegend
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80,
            right: 10
          }}
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
            formatter: timeByMicroTwoDecimalPlaces
          }}
        />
      </DashboardSection>
      {!memoryMetricsBugged
        ? <DashboardSection
            title={`Memory ${memoryLimitBytes ? '(Limit: ' + bytesTwoDecimalPlaces(memoryLimitBytes) + ')' : ''}`}
          >
            <ChartWithLegend
              snapshotId={snapshotId}
              timeframe={timeframe}
              margins={{
                left: 80,
                right: 10
              }}
              y1={{
                min: 0,
                metrics: ['memory.usage', 'memory.total_rss', 'memory.total_cache'],
                labels: ['Usage', 'RSS', 'Cache'],
                formatter: bytesTwoDecimalPlaces,
                type: 'line'
              }}
            />
            <ChartWithLegend
              snapshotId={snapshotId}
              timeframe={timeframe}
              margins={{
                left: 80,
                right: 10
              }}
              y1={{
                min: 0,
                metrics: ['memory.active_anon', 'memory.active_file', 'memory.inactive_anon', 'memory.inactive_file'],
                labels: ['active_anon', 'active_file', 'inactive_anon', 'inactive_file'],
                formatter: bytesTwoDecimalPlaces,
                type: 'line'
              }}
            />
          </DashboardSection>
        : null}

      <DashboardSection title="Block IO">
        <ChartWithLegend
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80,
            right: 10
          }}
          y1={{
            min: 0,
            metrics: ['blkio.blk_read', 'blkio.blk_write'],
            labels: ['Read', 'Write'],
            type: 'line',
            formatter: bytesTwoDecimalPlaces
          }}
        />
      </DashboardSection>
      {hasNetworkMetrics
        ? <DashboardSection title="Network">
            <ChartWithLegend
              snapshotId={snapshotId}
              timeframe={timeframe}
              margins={{
                left: 80,
                right: 80
              }}
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
            />
          </DashboardSection>
        : null}
    </div>
  );
}
