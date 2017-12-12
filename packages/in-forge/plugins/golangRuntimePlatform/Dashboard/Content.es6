import React from 'react';

import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { timeNs, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import Chart from 'in-components/Chart';
import MetricValue from 'in-components/MetricValue';
import { getLabel } from 'in-sdk/snapshot';

export default function GolangDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiHeading>{getLabel(snapshot)}</KpiHeading>
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
        <DashboardSection title="Memory Usage">{renderMemoryMetrics(snapshot, timeframe)}</DashboardSection>

        <DashboardSection title="Heap Usage">{renderHeapMetrics(snapshot, timeframe)}</DashboardSection>
      </Columize>

      <DashboardSection title="GC Activity">
        <Chart
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          y1={{
            min: 0,
            formatter: timeNs,
            metrics: ['metrics.memory.pause_ns'],
            labels: ['GC Pause'],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Goroutines">
        <Chart
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['metrics.goroutine'],
            labels: ['Executed Goroutines'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}

function renderHeapMetrics(snapshot, timeframe) {
  return (
    <Chart
      snapshotId={snapshot.get('id')}
      timeframe={timeframe}
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
    />
  );
}

function renderMemoryMetrics(snapshot, timeframe) {
  return (
    <Chart
      snapshotId={snapshot.get('id')}
      timeframe={timeframe}
      y1={{
        min: 0,
        formatter: bytesTwoDecimalPlaces,
        metrics: ['metrics.memory.alloc', 'metrics.memory.sys'],
        labels: ['Allocated Memory', 'Obtained From System'],
        type: 'line'
      }}
    />
  );
}
