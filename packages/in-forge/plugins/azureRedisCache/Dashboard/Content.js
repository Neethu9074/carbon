/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import {
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  zeroDecimalPlaces,
  twoDecimalPlaces,
  percentagePlainTwoDecimalPlaces,
  muSecondsZeroDecimalPlaces
} from 'in-services/formatters/number';
import RedisCacheShardTable from 'in-forge/plugins/azureRedisCache/Dashboard/RedisCacheShardTable.js';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import MetricValue from 'in-components/MetricValue';

export default function AzureRedisCacheDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="Operations Per Second">
          <MetricValue snapshotId={snapshotId} metric="operationsPerSecond" formatter={zeroDecimalPlaces} />
        </KpiKeyValue>

        <KpiKeyValue label="Keys Evicted">
          <MetricValue snapshotId={snapshotId} metric="evictedkeys" />
        </KpiKeyValue>

        <KpiKeyValue label="Connections">
          <MetricValue snapshotId={snapshotId} metric="connectedclients" />
        </KpiKeyValue>

        <KpiKeyValue label="Latency">
          <MetricValue snapshotId={snapshotId} metric="cacheLatency" formatter={muSecondsZeroDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title="Operations Per Second">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['operationsPerSecond'],
            labels: ['Operations Per Second'],
            formatter: zeroDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Cache Hits/Misses">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['cachehits', 'cachemisses'],
            labels: ['Cache Hits', 'Cache Misses'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Gets/Sets">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['getcommands', 'setcommands'],
            labels: ['Gets', 'Sets'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Keys Expired/Evicted">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['expiredkeys', 'evictedkeys'],
            labels: ['Keys Expired', 'Keys Evicted'],
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
            min: 0,
            formatter: bytesZeroDecimalPlaces,
            tooltipFormatter: bytesTwoDecimalPlaces,
            metrics: ['usedmemoryRss', 'usedmemory'],
            labels: ['Used RSS', 'Used'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Cache Read/Write">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytesZeroDecimalPlaces,
            tooltipFormatter: bytesTwoDecimalPlaces,
            metrics: ['cacheRead', 'cacheWrite'],
            labels: ['Cache Read', 'Cache Write'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Total Operations">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['totalcommandsprocessed'],
            labels: ['Total Operations'],
            formatter: zeroDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Total Keys">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['totalkeys'],
            labels: ['Total Keys'],
            formatter: zeroDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Server Load">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['serverLoad'],
            labels: ['Server Load'],
            formatter: twoDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="CPU">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['percentProcessorTime'],
            labels: ['CPU'],
            formatter: twoDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Connections">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['connectedclients'],
            labels: ['Connections'],
            formatter: zeroDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Used Memory Percentage">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['usedmemorypercentage'],
            labels: ['Used Memory Percentage'],
            formatter: percentagePlainTwoDecimalPlaces,
            type: 'area'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Latency">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['cacheLatency'],
            labels: ['Latency'],
            formatter: muSecondsZeroDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Errors">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['errors'],
            labels: ['Errors'],
            formatter: zeroDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <RedisCacheShardTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
