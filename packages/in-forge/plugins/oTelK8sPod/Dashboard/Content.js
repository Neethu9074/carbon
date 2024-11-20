/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
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

export default function OTelK8SPodDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  //OTel Kuberenetes metric dashboards UI is controlled by flag "openTelemetryKubernetes"
  //The dashboard will be shown only when the flag in addition to setting up of OpenTelemetry
  //on Kubernetes environment is set. Collection of OTel metrics couldn't happen in normal scenarios.
  const otek8sEnabled = openTelemetryKubernetes ? true : false;

  return otek8sEnabled ? (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.oTelK8sPod.dashboard.poduptime')}>
          <MetricValue snapshotId={snapshotId} metric="k8s.pod.uptime" formatter={timeBySecondsTwoDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.oTelK8sPod.dashboard.cpunodeutilization')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="k8s.pod.cpu.node.utilization"
            formatter={percentageTwoDecimalPlaces}
            windowForLatest={WINDOW_FOR_LATEST_METRIC}
          />
        </KpiKeyValue>
      </KpiSection>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.oTelK8sPod.dashboard.cpuutilization')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="k8s.pod.cpu.utilization"
            formatter={percentageTwoDecimalPlaces}
            windowForLatest={WINDOW_FOR_LATEST_METRIC}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.oTelK8sPod.dashboard.cputime')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="k8s.pod.cpu.time"
            formatter={timeBySecondsTwoDecimalPlaces}
            windowForLatest={WINDOW_FOR_LATEST_METRIC}
          />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.oTelK8sPod.dashboard.cpuresources')}>
        <Chart
          distanceBetweenDatapointsInMillis={DISTANCE_BETWEEN_DATAPOINTS}
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'k8s.pod.cpu.usage',
              'k8s.pod.cpu.utilization',
              'k8s.pod.cpu.limit_utilization',
              'k8s.pod.cpu.request_utlization'
            ],
            labels: [
              t('in-forge:plugins.oTelK8sPod.dashboard.cpuusage'),
              t('in-forge:plugins.oTelK8sPod.dashboard.cpuutilization'),
              t('in-forge:plugins.oTelK8sPod.dashboard.cpulimitutilization'),
              t('in-forge:plugins.oTelK8sPod.dashboard.cpurequestutilization')
            ],
            type: 'stackedArea',
            formatter: percentageTwoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.oTelK8sPod.dashboard.memoryusage')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="k8s.pod.memory.usage"
            formatter={bytesTwoDecimalPlaces}
            windowForLatest={WINDOW_FOR_LATEST_METRIC}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.oTelK8sPod.dashboard.memoryavailable')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="k8s.pod.memory.available"
            formatter={bytesTwoDecimalPlaces}
            windowForLatest={WINDOW_FOR_LATEST_METRIC}
          />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.oTelK8sPod.dashboard.memoryresources')}>
        <Chart
          distanceBetweenDatapointsInMillis={DISTANCE_BETWEEN_DATAPOINTS}
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'k8s.pod.memory.usage',
              'k8s.pod.memory.available',
              'k8s.pod.memory.limit_utilization',
              'k8s.pod.memory.request_utilization',
              'k8s.pod.memory.rss',
              'k8s.pod.memory.working_set',
              'k8s.pod.memory.page_faults',
              'k8s.pod.memory.major_page_faults'
            ],
            labels: [
              t('in-forge:plugins.oTelK8sPod.dashboard.memoryusage'),
              t('in-forge:plugins.oTelK8sPod.dashboard.memoryavailable'),
              t('in-forge:plugins.oTelK8sPod.dashboard.memorylimitutilization'),
              t('in-forge:plugins.oTelK8sPod.dashboard.memoryrequestutilization'),
              t('in-forge:plugins.oTelK8sPod.dashboard.memoryrss'),
              t('in-forge:plugins.oTelK8sPod.dashboard.memoryworkingset'),
              t('in-forge:plugins.oTelK8sPod.dashboard.memorypagefaults'),
              t('in-forge:plugins.oTelK8sPod.dashboard.memorymajorpagefaults')
            ],
            type: 'stackedArea',
            formatter: percentageTwoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.oTelK8sPod.dashboard.fsusage')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="k8s.pod.filesystem.usage"
            formatter={bytesTwoDecimalPlaces}
            windowForLatest={WINDOW_FOR_LATEST_METRIC}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.oTelK8sPod.dashboard.fsavailble')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="k8s.pod.filesystem.available"
            formatter={bytesTwoDecimalPlaces}
            windowForLatest={WINDOW_FOR_LATEST_METRIC}
          />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.oTelK8sPod.dashboard.fsresources')}>
        <Chart
          distanceBetweenDatapointsInMillis={DISTANCE_BETWEEN_DATAPOINTS}
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['k8s.pod.filesystem.usage', 'k8s.pod.filesystem.available', 'k8s.pod.filesystem.capacity'],
            labels: [
              t('in-forge:plugins.oTelK8sPod.dashboard.fsusage'),
              t('in-forge:plugins.oTelK8sPod.dashboard.fsavailble'),
              t('in-forge:plugins.oTelK8sPod.dashboard.fscapacity')
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
        titlePrefix={t('in-forge:plugins.oTelK8sPod.type')}
        specs={SPECS}
      />
    </div>
  ) : null;
}
export const SPECS = [AVAILABLE_SPECS.GAUGE, AVAILABLE_SPECS.HISTOGRAM, AVAILABLE_SPECS.SUM, AVAILABLE_SPECS.SUMMARY];
