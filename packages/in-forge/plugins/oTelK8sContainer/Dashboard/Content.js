/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import {
  bytesTwoDecimalPlaces,
  percentageTwoDecimalPlaces,
  timeBySecondsTwoDecimalPlaces
} from 'in-services/formatters/number';
import { WINDOW_FOR_LATEST_METRIC, DISTANCE_BETWEEN_DATAPOINTS } from 'in-forge/plugins/oTelJvm/constants';
import CustomMetricsV2, { AVAILABLE_SPECS } from 'in-sdk/components/dashboard/CustomMetricsV2';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { openTelemetryKubernetes } from 'in-services/featureFlags';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function OTelK8SContainerDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  //OTel Kuberenetes metric dashboards UI is controlled by flag "openTelemetryKubernetes"
  //The dashboard will be shown only when the flag in addition to setting up of OpenTelemetry
  //on Kubernetes environment is set. Collection of OTel metrics couldn't happen in normal scenarios.
  return openTelemetryKubernetes ? (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.oTelK8sContainer.dashboard.containeruptime')}>
          <MetricValue snapshotId={snapshotId} metric="container.uptime" formatter={timeBySecondsTwoDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.oTelK8sContainer.dashboard.cpunodeutilization')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="container.cpu.node.utilization"
            formatter={percentageTwoDecimalPlaces}
            windowForLatest={WINDOW_FOR_LATEST_METRIC}
          />
        </KpiKeyValue>
      </KpiSection>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.oTelK8sContainer.dashboard.cpuutilization')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="container.cpu.utilization"
            formatter={percentageTwoDecimalPlaces}
            windowForLatest={WINDOW_FOR_LATEST_METRIC}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.oTelK8sContainer.dashboard.cputime')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="container.cpu.time"
            formatter={timeBySecondsTwoDecimalPlaces}
            windowForLatest={WINDOW_FOR_LATEST_METRIC}
          />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.oTelK8sContainer.dashboard.cpuresources')}>
        <Chart
          distanceBetweenDatapointsInMillis={DISTANCE_BETWEEN_DATAPOINTS}
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'container.cpu.usage',
              'container.cpu.utilization',
              'container.cpu.limit_utilization',
              'container.cpu.request_utlization'
            ],
            labels: [
              t('in-forge:plugins.oTelK8sContainer.dashboard.cpuusage'),
              t('in-forge:plugins.oTelK8sContainer.dashboard.cpuutilization'),
              t('in-forge:plugins.oTelK8sContainer.dashboard.cpulimitutilization'),
              t('in-forge:plugins.oTelK8sContainer.dashboard.cpurequestutilization')
            ],
            type: 'stackedArea',
            formatter: percentageTwoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.oTelK8sContainer.dashboard.memoryusage')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="container.memory.usage"
            formatter={bytesTwoDecimalPlaces}
            windowForLatest={WINDOW_FOR_LATEST_METRIC}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.oTelK8sContainer.dashboard.memoryavailable')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="container.memory.available"
            formatter={bytesTwoDecimalPlaces}
            windowForLatest={WINDOW_FOR_LATEST_METRIC}
          />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.oTelK8sContainer.dashboard.memoryresources')}>
        <Chart
          distanceBetweenDatapointsInMillis={DISTANCE_BETWEEN_DATAPOINTS}
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'container.memory.usage',
              'container.memory.available',
              'container.memory.limit_utilization',
              'container.memory.request_utilization',
              'container.memory.rss',
              'container.memory.working_set',
              'container.memory.page_faults',
              'container.memory.major_page_faults'
            ],
            labels: [
              t('in-forge:plugins.oTelK8sContainer.dashboard.memoryusage'),
              t('in-forge:plugins.oTelK8sContainer.dashboard.memoryavailable'),
              t('in-forge:plugins.oTelK8sContainer.dashboard.memorylimitutilization'),
              t('in-forge:plugins.oTelK8sContainer.dashboard.memoryrequestutilization'),
              t('in-forge:plugins.oTelK8sContainer.dashboard.memoryrss'),
              t('in-forge:plugins.oTelK8sContainer.dashboard.memoryworkingset'),
              t('in-forge:plugins.oTelK8sContainer.dashboard.memorypagefaults'),
              t('in-forge:plugins.oTelK8sContainer.dashboard.memorymajorpagefaults')
            ],
            type: 'stackedArea',
            formatter: bytesTwoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.oTelK8sContainer.dashboard.fsusage')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="container.filesystem.usage"
            formatter={bytesTwoDecimalPlaces}
            windowForLatest={WINDOW_FOR_LATEST_METRIC}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.oTelK8sContainer.dashboard.fsavailble')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="container.filesystem.available"
            formatter={bytesTwoDecimalPlaces}
            windowForLatest={WINDOW_FOR_LATEST_METRIC}
          />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.oTelK8sContainer.dashboard.fsresources')}>
        <Chart
          distanceBetweenDatapointsInMillis={DISTANCE_BETWEEN_DATAPOINTS}
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['container.filesystem.usage', 'container.filesystem.available', 'container.filesystem.capacity'],
            labels: [
              t('in-forge:plugins.oTelK8sContainer.dashboard.fsusage'),
              t('in-forge:plugins.oTelK8sContainer.dashboard.fsavailble'),
              t('in-forge:plugins.oTelK8sContainer.dashboard.fscapacity')
            ],
            type: 'stackedArea',
            formatter: bytesTwoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <CustomMetricsV2
        snapshot={snapshot}
        timeConfig={timeConfig}
        titlePrefix={t('in-forge:plugins.oTelK8sContainer.type')}
        specs={SPECS}
      />
    </div>
  ) : null;
}
export const SPECS = [AVAILABLE_SPECS.GAUGE, AVAILABLE_SPECS.HISTOGRAM, AVAILABLE_SPECS.SUM, AVAILABLE_SPECS.SUMMARY];
