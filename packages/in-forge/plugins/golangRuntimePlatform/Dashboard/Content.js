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
import { t } from 'in-i18n';

export default function GolangDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.golangRuntimePlatform.dashboard.gcPause')}>
          <MetricValue snapshotId={snapshotId} metric="metrics.memory.pause_ns" formatter={timeNs} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.golangRuntimePlatform.dashboard.heapUsed')}>
          <MetricValue snapshotId={snapshotId} metric="metrics.memory.heap_in_use" formatter={bytesTwoDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.golangRuntimePlatform.dashboard.executedGoroutines')}>
          <MetricValue snapshotId={snapshotId} metric="metrics.goroutine" />
        </KpiKeyValue>
      </KpiSection>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.golangRuntimePlatform.dashboard.memoryUsage')}>
          {renderMemoryMetrics(snapshot, timeConfig)}
        </DashboardSection>

        <DashboardSection title={t('in-forge:plugins.golangRuntimePlatform.dashboard.heapUsage')}>
          {renderHeapMetrics(snapshot, timeConfig)}
        </DashboardSection>
      </Columize>

      <DashboardSection title={t('in-forge:plugins.golangRuntimePlatform.dashboard.gcActivity')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: timeNs,
            metrics: ['metrics.memory.pause_ns'],
            labels: [t('in-forge:plugins.golangRuntimePlatform.dashboard.gcPause')],
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.golangRuntimePlatform.dashboard.goroutines')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['metrics.goroutine'],
            labels: [t('in-forge:plugins.golangRuntimePlatform.dashboard.executedGoroutines')],
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
        labels: [
          t('in-forge:plugins.golangRuntimePlatform.dashboard.systemHeap'),
          t('in-forge:plugins.golangRuntimePlatform.dashboard.usedHeap')
        ],
        type: 'line'
      }}
      y2={{
        min: 0,
        metrics: ['metrics.memory.heap_objects'],
        labels: [t('in-forge:plugins.golangRuntimePlatform.dashboard.objects')],
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
        labels: [
          t('in-forge:plugins.golangRuntimePlatform.dashboard.allocatedMemory'),
          t('in-forge:plugins.golangRuntimePlatform.dashboard.obtainedFromSystem')
        ],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
