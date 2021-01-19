/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { timeNs, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';

export default function GolangDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="GC Pause">
          <MetricValue snapshotId={snapshotId} metric="metrics.memory.pause_ns" formatter={timeNs} />
        </KpiKeyValue>
        <KpiKeyValue label="Heap Used">
          <MetricValue snapshotId={snapshotId} metric="metrics.memory.heap_in_use" formatter={bytesTwoDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label="Executed Goroutines">
          <MetricValue snapshotId={snapshotId} metric="metrics.goroutine" />
        </KpiKeyValue>
      </KpiSection>

      <Columize>
        <DashboardSection title="Memory Usage">{renderMemoryMetrics(snapshot, timeConfig)}</DashboardSection>

        <DashboardSection title="Heap Usage">{renderHeapMetrics(snapshot, timeConfig)}</DashboardSection>
      </Columize>

      <DashboardSection title="GC Activity">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: timeNs,
            metrics: ['metrics.memory.pause_ns'],
            labels: ['GC Pause'],
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Goroutines">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['metrics.goroutine'],
            labels: ['Executed Goroutines'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}

function renderHeapMetrics(snapshot, timeConfig) {
  return (
    <Chart
      snapshotId={snapshot.get('id')}
      timeConfig={timeConfig}
      y1={{
        min: 0,
        formatter: bytesTwoDecimalPlaces,
        metrics: ['metrics.memory.heap_sys', 'metrics.memory.heap_in_use'],
        labels: ['System Heap', 'Used Heap'],
        type: 'line'
      }}
      y2={{
        min: 0,
        metrics: ['metrics.memory.heap_objects'],
        labels: ['Objects'],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}

function renderMemoryMetrics(snapshot, timeConfig) {
  return (
    <Chart
      snapshotId={snapshot.get('id')}
      timeConfig={timeConfig}
      y1={{
        min: 0,
        formatter: bytesTwoDecimalPlaces,
        metrics: ['metrics.memory.alloc', 'metrics.memory.sys'],
        labels: ['Allocated Memory', 'Obtained From System'],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
