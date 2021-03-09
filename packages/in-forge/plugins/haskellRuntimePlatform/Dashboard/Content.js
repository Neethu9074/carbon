/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { bytesTwoDecimalPlaces, millis, time, twoDecimalPlaces } from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartExplanation from 'in-sdk/components/dashboard/ChartExplanation';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { gaugeMetricNames } from '../metricDefinitions';
import MetricValue from 'in-components/MetricValue';
import GaugesTable from './GaugesTable';
import { t } from 'in-i18n';

export default function HaskellDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.haskellRuntimePlatform.dashboard.cpuTimeSecond')}>
          <MetricValue snapshotId={snapshotId} metric="rts.gc.cpu_ms_delta" formatter={millis.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.haskellRuntimePlatform.dashboard.gcCpuTimeSecond')}>
          <MetricValue snapshotId={snapshotId} metric="rts.gc.gc_cpu_ms_delta" formatter={millis.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.haskellRuntimePlatform.dashboard.gcWallClockTimeSecond')}>
          <MetricValue snapshotId={snapshotId} metric="rts.gc.gc_wall_ms_delta" formatter={millis.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.haskellRuntimePlatform.dashboard.hashGCsSecond')}>
          <MetricValue snapshotId={snapshotId} metric="rts.gc.num_gcs_delta" formatter={twoDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.haskellRuntimePlatform.dashboard.totalBytesAllocatedSecond')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="rts.gc.bytes_allocated_delta"
            formatter={bytesTwoDecimalPlaces}
          />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title={t('in-forge:plugins.haskellRuntimePlatform.dashboard.gcTimes')}>
        <ChartExplanation>
          <div>
            <ul>
              <li>{t('in-forge:plugins.haskellRuntimePlatform.dashboard.gcCpuTimeCpuTimeSpentRunningGc')}</li>
              <li>
                {t('in-forge:plugins.haskellRuntimePlatform.dashboard.gcWallClockTimeWallClockTimeSpentRunningGc')}
              </li>
              <li>
                {t(
                  'in-forge:plugins.haskellRuntimePlatform.dashboard.mutatorThreadsCpuTimeCpuTimeSpentRunningMutatorThreadsThisDoesNotIncludeAnyProfilingOverheadOrInitialization'
                )}
              </li>
            </ul>
          </div>
        </ChartExplanation>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: time,
            metrics: ['rts.gc.gc_cpu_ms_delta', 'rts.gc.gc_wall_ms_delta', 'rts.gc.mutator_cpu_ms_delta'],
            labels: [
              t('in-forge:plugins.haskellRuntimePlatform.dashboard.gcCpuTimeSecond2'),
              t('in-forge:plugins.haskellRuntimePlatform.dashboard.gcWallClockTimeSecond2'),
              t('in-forge:plugins.haskellRuntimePlatform.dashboard.mutatorThreadsCpuTimeSecond')
            ],
            type: 'point'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.haskellRuntimePlatform.dashboard.gcBytes')}>
        <ChartExplanation>
          <div>
            <ul>
              <li>{t('in-forge:plugins.haskellRuntimePlatform.dashboard.bytesCopiedNumberOfBytesCopiedDuringGc')}</li>
              <li>
                {t('in-forge:plugins.haskellRuntimePlatform.dashboard.byteUsageSamplesNumberOfByteUsageSamplesTaken')}
              </li>
            </ul>
          </div>
        </ChartExplanation>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytesTwoDecimalPlaces,
            metrics: ['rts.gc.bytes_copied_delta', 'rts.gc.num_bytes_usage_samples_delta'],
            labels: [
              t('in-forge:plugins.haskellRuntimePlatform.dashboard.bytesCopiedSecond'),
              t('in-forge:plugins.haskellRuntimePlatform.dashboard.byteUsageSamplesSecond')
            ],
            type: 'point'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.haskellRuntimePlatform.dashboard.cpu')}>
        <ChartExplanation>
          {t('in-forge:plugins.haskellRuntimePlatform.dashboard.cpuTimeCpuTimePerSecond')}
        </ChartExplanation>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: time,
            metrics: ['rts.gc.cpu_ms_delta'],
            labels: [t('in-forge:plugins.haskellRuntimePlatform.dashboard.totalCpuTimeSecond')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.haskellRuntimePlatform.dashboard.gCsSecond')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: twoDecimalPlaces,
            metrics: ['rts.gc.num_gcs_delta'],
            labels: [t('in-forge:plugins.haskellRuntimePlatform.dashboard.hashGCsSecond2')],
            type: 'point'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <GaugesTable
        snapshot={snapshot}
        timeConfig={timeConfig}
        metrics={gaugeMetricNames}
        title={t('in-forge:plugins.haskellRuntimePlatform.dashboard.gcGauges')}
      />
    </div>
  );
}
