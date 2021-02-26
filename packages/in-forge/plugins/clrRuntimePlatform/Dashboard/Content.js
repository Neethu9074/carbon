/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import {
  zeroDecimalPlaces,
  twoDecimalPlaces,
  bytesTwoDecimalPlaces,
  bytesZeroDecimalPlaces,
  percentage
} from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import MetricValue from 'in-components/MetricValue';

export default function ClrDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.clrRuntimePlatform.dashboard.labelAllHeaps')}>
          <MetricValue snapshotId={snapshotId} metric="mem.all_heaps" formatter={bytesZeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.clrRuntimePlatform.dashboard.labelTime')}>
          <MetricValue snapshotId={snapshotId} metric="mem.time_in_gcn" formatter={percentage.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.clrRuntimePlatform.dashboard.labelContentionRate')}>
          <MetricValue snapshotId={snapshotId} metric="threads.lck_crs" formatter={twoDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.clrRuntimePlatform.dashboard.labelQueueLength')}>
          <MetricValue snapshotId={snapshotId} metric="threads.lck_cql" formatter={zeroDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title={t('in-forge:plugins.clrRuntimePlatform.dashboard.titleGarbageCollections')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['mem.gen0GC', 'mem.gen1GC', 'mem.gen2GC'],
            labels: [
              t('in-forge:plugins.clrRuntimePlatform.dashboard.labelGeneration0'),
              t('in-forge:plugins.clrRuntimePlatform.dashboard.labelGeneration1'),
              t('in-forge:plugins.clrRuntimePlatform.dashboard.labelGeneration2')
            ],
            type: 'point',
            formatter: zeroDecimalPlaces
          }}
          y2={{
            min: 0,
            max: 1,
            metrics: ['mem.time_in_gcn'],
            labels: [t('in-forge:plugins.clrRuntimePlatform.dashboard.labelTimeSpentInGC')],
            type: 'line',
            formatter: percentage.compact,
            tooltipFormatter: percentage.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.clrRuntimePlatform.dashboard.titleSizesOfHeaps')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytesTwoDecimalPlaces,
            metrics: ['mem.gen1HeapBytes', 'mem.gen2HeapBytes', 'mem.loHeapBytes'],
            labels: [
              t('in-forge:plugins.clrRuntimePlatform.dashboard.labelGeneration1'),
              t('in-forge:plugins.clrRuntimePlatform.dashboard.labelGeneration2'),
              t('in-forge:plugins.clrRuntimePlatform.dashboard.labelLargeObject')
            ],
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.clrRuntimePlatform.dashboard.titleThreadLocks')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: zeroDecimalPlaces,
            metrics: ['threads.lck_cql'],
            labels: [t('in-forge:plugins.clrRuntimePlatform.dashboard.labelQueueLength')],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: twoDecimalPlaces,
            metrics: ['threads.lck_crs'],
            labels: [t('in-forge:plugins.clrRuntimePlatform.dashboard.labelContentionRate')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
