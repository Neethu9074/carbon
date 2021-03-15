/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  zeroDecimalPlaces,
  twoDecimalPlaces,
  msTwoDecimalPlaces,
  kiloBytesZeroDecimalPlaces,
  kiloBytesTwoDecimalPlaces
} from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function RubyDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.rubyRuntimePlatform.dashboard.rss')}>
          <MetricValue
            snapshotId={snapshot.get('id')}
            metric="memory.rss_size"
            formatter={kiloBytesZeroDecimalPlaces}
          />
        </KpiKeyValue>
      </KpiSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.rubyRuntimePlatform.dashboard.timeSpentInGc')}>
          <GcTime snapshot={snapshot} timeConfig={timeConfig} />
        </DashboardSection>
      </Columize>
      <DashboardSection title={t('in-forge:plugins.rubyRuntimePlatform.dashboard.memory')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: kiloBytesTwoDecimalPlaces,
            metrics: ['memory.rss_size'],
            labels: [t('in-forge:plugins.rubyRuntimePlatform.dashboard.resident')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.rubyRuntimePlatform.dashboard.heapSlots')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: zeroDecimalPlaces,
            metrics: ['gc.heap_live', 'gc.heap_free'],
            labels: [
              t('in-forge:plugins.rubyRuntimePlatform.dashboard.live'),
              t('in-forge:plugins.rubyRuntimePlatform.dashboard.free')
            ],
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.rubyRuntimePlatform.dashboard.threads')}>
          <ThreadMetrics snapshot={snapshot} timeConfig={timeConfig} />
        </DashboardSection>
      </Columize>
    </div>
  );
}

function GcTime({ snapshot, timeConfig }) {
  return (
    <Chart
      snapshotId={snapshot.get('id')}
      timeConfig={timeConfig}
      y1={{
        min: 0,
        formatter: msTwoDecimalPlaces,
        metrics: ['gc.totalTime'],
        labels: [t('in-forge:plugins.rubyRuntimePlatform.dashboard.gcRunDuration')],
        type: 'line'
      }}
      y2={{
        min: 0,
        tooltipFormatter: zeroDecimalPlaces,
        formatter: twoDecimalPlaces,
        metrics: ['gc.minorGcs', 'gc.majorGcs'],
        labels: [
          t('in-forge:plugins.rubyRuntimePlatform.dashboard.minorGCs'),
          t('in-forge:plugins.rubyRuntimePlatform.dashboard.majorGCs')
        ],
        type: 'point'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}

function ThreadMetrics({ snapshot, timeConfig }) {
  return (
    <Chart
      snapshotId={snapshot.get('id')}
      timeConfig={timeConfig}
      y1={{
        min: 0,
        formatter: zeroDecimalPlaces,
        metrics: ['thread.count'],
        labels: [t('in-forge:plugins.rubyRuntimePlatform.dashboard.threadCount')],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
