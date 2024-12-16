/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { WINDOW_FOR_LATEST_METRIC, DISTANCE_BETWEEN_DATAPOINTS } from 'in-forge/plugins/oTelJvm/constants';
import CustomMetricsV2, { AVAILABLE_SPECS } from 'in-sdk/components/dashboard/CustomMetricsV2';
import OTelMemoryPoolsTable from 'in-forge/plugins/oTelJvm/Dashboard/OTelMemoryPoolsTable';
import { bytes, twoDecimalPlaces, percentage } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartExplanation from 'in-sdk/components/dashboard/ChartExplanation';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t, Trans } from 'in-i18n';

export default function OTelJVMDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.oTelJvm.dashboard.memoryUsed')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="jvm.memory.heap_used"
            formatter={bytesTwoDecimalPlaces}
            windowForLatest={WINDOW_FOR_LATEST_METRIC}
          />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title={t('in-forge:plugins.oTelJvm.dashboard.threads')}>
        <ChartExplanation>
          <Trans i18nKey="in-forge:plugins.oTelJvm.dashboard.theNumberOfThreadsIsQuiteStaticInMostApps" />
        </ChartExplanation>

        <Chart
          distanceBetweenDatapointsInMillis={DISTANCE_BETWEEN_DATAPOINTS}
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'jvm.threads.states_new',
              'jvm.threads.states_runnable',
              'jvm.threads.states_timed-waiting',
              'jvm.threads.states_waiting',
              'jvm.threads.states_blocked'
            ],
            labels: [
              t('in-forge:plugins.oTelJvm.dashboard.new'),
              t('in-forge:plugins.oTelJvm.dashboard.runnable'),
              t('in-forge:plugins.oTelJvm.dashboard.timedwaiting'),
              t('in-forge:plugins.oTelJvm.dashboard.waiting'),
              t('in-forge:plugins.oTelJvm.dashboard.blocked')
            ],
            type: 'stackedArea',
            formatter: twoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.oTelJvm.dashboard.heapMemory')}>
        <ChartExplanation>
          {t('in-forge:plugins.oTelJvm.dashboard.theTotalUsedHeapMemoryUsageWillUsuallyGoUpUntil')}
        </ChartExplanation>
        <Chart
          distanceBetweenDatapointsInMillis={DISTANCE_BETWEEN_DATAPOINTS}
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            max: snapshot.getIn(['data', 'jvm.memory.heap_max']),
            formatter: bytes.detailed,
            tooltipFormatter: bytes.detailedWithRaw,
            metrics: ['jvm.memory.heap_used'],
            labels: [t('in-forge:plugins.oTelJvm.dashboard.used')],
            type: 'stackedArea'
          }}
          y2={{
            min: 0,
            metrics: ['jvm.memory.heap_perc'],
            labels: [t('in-forge:plugins.oTelJvm.dashboard.usedPercentage')],
            formatter: percentage.detailed,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <OTelMemoryPoolsTable snapshot={snapshot} timeConfig={timeConfig} />

      <DashboardSection title={t('in-forge:plugins.oTelJvm.dashboard.garbageCollectionHeapMemory')}>
        <Chart
          distanceBetweenDatapointsInMillis={DISTANCE_BETWEEN_DATAPOINTS}
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            max: snapshot.getIn(['data', 'jvm.memory.heap_max']),
            formatter: bytes.detailed,
            tooltipFormatter: bytes.detailedWithRaw,
            metrics: ['jvm.memory.heap_used'],
            labels: [t('in-forge:plugins.oTelJvm.dashboard.used')],
            type: 'line'
          }}
          y2={{
            min: 0,
            max: snapshot.getIn(['data', 'jvm.memory.heap_max']),
            metrics: ['memory.gc.before', 'process.runtime.jvm.memory.usage_after_last_gc_totalHeap'],
            labels: [t('in-forge:plugins.oTelJvm.dashboard.gcBefore'), t('in-forge:plugins.oTelJvm.dashboard.gcAfter')],
            formatter: bytes.detailed,
            tooltipFormatter: bytes.detailedWithRaw,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <CustomMetricsV2
        snapshot={snapshot}
        timeConfig={timeConfig}
        titlePrefix={t('in-forge:plugins.oTelJvm.type')}
        specs={SPECS}
        distanceBetweenDatapointsInMillis={DISTANCE_BETWEEN_DATAPOINTS}
      />
    </div>
  );
}
export const SPECS = [AVAILABLE_SPECS.GAUGE, AVAILABLE_SPECS.HISTOGRAM, AVAILABLE_SPECS.SUM, AVAILABLE_SPECS.SUMMARY];
