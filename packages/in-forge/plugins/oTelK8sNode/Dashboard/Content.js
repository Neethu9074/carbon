/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  bytesTwoDecimalPlaces,
  percentageTwoDecimalPlaces,
  timeBySecondsTwoDecimalPlaces
} from 'in-services/formatters/number';
import { DISTANCE_BETWEEN_DATAPOINTS, WINDOW_FOR_LATEST_METRIC } from 'in-forge/plugins/oTelJvm/constants';
import DashboardHeaderModule, { themes } from 'in-components/DashboardHeader/DashboardHeaderModule';
import CustomMetricsV2, { AVAILABLE_SPECS } from 'in-sdk/components/dashboard/CustomMetricsV2';
import getOtelKubernetesPodsOfNodes from 'in-subscription/getOtelKubernetesPodsOfNodes';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { openTelemetryKubernetes } from 'in-services/featureFlags';
import Pods from 'in-forge/plugins/oTelK8sCluster/Dashboard/Pods';
import { pendingResult } from 'in-services/fixedObjects';
import MetricValue from 'in-components/MetricValue';
import { minutes } from 'in-services/time';
import { t } from 'in-i18n';

export default function OTelK8SNodeDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  const [activeTab, setActiveTab] = useState('summary');
  const TABS = {
    SUMMARY: 'summary',
    PODS: 'pods'
  };

  const handleTabChange = tab => {
    setActiveTab(tab);
  };

  const otelPods =
    useObservable(
      getOtelKubernetesPodsOfNodes({
        pagination: {
          page: 1,
          pageSize: snapshot.get('podcount') || 10
        },
        order: {
          by: 'id',
          direction: 'DESC'
        },
        filter: {
          nodeId: snapshot.get('id'),
          timeConfig: {
            to: Date.now(),
            windowSize: minutes.toMillis(30),
            focusedMoment: Date.now(),
            autoRefresh: false
          }
        }
      }),
      []
    ) ?? pendingResult;

  const SummaryContent = ({ snapshotId }) => (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.oTelK8sNode.dashboard.nodecondition')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="k8s.node.condition"
            formatter={bytesTwoDecimalPlaces}
            windowForLatest={WINDOW_FOR_LATEST_METRIC}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.oTelK8sNode.dashboard.nodeuptime')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="k8s.node.uptime"
            formatter={timeBySecondsTwoDecimalPlaces}
            windowForLatest={WINDOW_FOR_LATEST_METRIC}
          />
        </KpiKeyValue>
      </KpiSection>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.oTelK8sNode.dashboard.cpuutilization')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="k8s.node.cpu.utilization"
            formatter={percentageTwoDecimalPlaces}
            windowForLatest={WINDOW_FOR_LATEST_METRIC}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.oTelK8sNode.dashboard.cputime')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="k8s.node.cpu.time"
            formatter={timeBySecondsTwoDecimalPlaces}
            windowForLatest={WINDOW_FOR_LATEST_METRIC}
          />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.oTelK8sNode.dashboard.cpuresources')}>
        <Chart
          distanceBetweenDatapointsInMillis={DISTANCE_BETWEEN_DATAPOINTS}
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['k8s.node.cpu.usage', 'k8s.node.cpu.utilization'],
            labels: [
              t('in-forge:plugins.oTelK8sNode.dashboard.cpuusage'),
              t('in-forge:plugins.oTelK8sNode.dashboard.cpuutilization')
            ],
            type: 'stackedArea',
            formatter: percentageTwoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.oTelK8sNode.dashboard.memoryusage')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="k8s.node.memory.usage"
            formatter={bytesTwoDecimalPlaces}
            windowForLatest={WINDOW_FOR_LATEST_METRIC}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.oTelK8sNode.dashboard.memoryavailable')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="k8s.node.memory.available"
            formatter={bytesTwoDecimalPlaces}
            windowForLatest={WINDOW_FOR_LATEST_METRIC}
          />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.oTelK8sNode.dashboard.memoryresources')}>
        <Chart
          distanceBetweenDatapointsInMillis={DISTANCE_BETWEEN_DATAPOINTS}
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'k8s.node.memory.usage',
              'k8s.node.memory.available',
              'k8s.node.memory.rss',
              'k8s.node.memory.working_set',
              'k8s.node.memory.page_faults',
              'k8s.node.memory.major_page_faults'
            ],
            labels: [
              t('in-forge:plugins.oTelK8sNode.dashboard.memoryusage'),
              t('in-forge:plugins.oTelK8sNode.dashboard.memoryavailable'),
              t('in-forge:plugins.oTelK8sNode.dashboard.memoryrss'),
              t('in-forge:plugins.oTelK8sNode.dashboard.memoryworkingset'),
              t('in-forge:plugins.oTelK8sNode.dashboard.memorypagefaults'),
              t('in-forge:plugins.oTelK8sNode.dashboard.memorymajorpagefaults')
            ],
            type: 'stackedArea',
            formatter: bytesTwoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.oTelK8sNode.dashboard.fsusage')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="k8s.node.filesystem.usage"
            formatter={bytesTwoDecimalPlaces}
            windowForLatest={WINDOW_FOR_LATEST_METRIC}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.oTelK8sNode.dashboard.fsavailble')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="k8s.node.filesystem.available"
            formatter={bytesTwoDecimalPlaces}
            windowForLatest={WINDOW_FOR_LATEST_METRIC}
          />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.oTelK8sNode.dashboard.fsresources')}>
        <Chart
          distanceBetweenDatapointsInMillis={DISTANCE_BETWEEN_DATAPOINTS}
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['k8s.node.filesystem.usage', 'k8s.node.filesystem.available', 'k8s.node.filesystem.capacity'],
            labels: [
              t('in-forge:plugins.oTelK8sNode.dashboard.fsusage'),
              t('in-forge:plugins.oTelK8sNode.dashboard.fsavailble'),
              t('in-forge:plugins.oTelK8sNode.dashboard.fscapacity')
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
        titlePrefix={t('in-forge:plugins.oTelK8sNode.type')}
        specs={SPECS}
      />
    </div>
  );

  const PodsContent = () => (
    <div>
      <Pods pods={otelPods?.data?.items || []} renderByDashboard />
    </div>
  );
  const CONTENT_MAP = {
    summary: SummaryContent,
    pods: PodsContent
  };

  // In the main component:
  const ContentComponent = CONTENT_MAP[activeTab];

  //OTel Kuberenetes metric dashboards UI is controlled by flag "openTelemetryKubernetes"
  //The dashboard will be shown only when the flag in addition to setting up of OpenTelemetry
  //on Kubernetes environment is set. Collection of OTel metrics couldn't happen in normal scenarios.
  const otek8sEnabled = openTelemetryKubernetes ? true : false;

  return otek8sEnabled ? (
    <div>
      <DashboardHeaderModule theme={themes.light}>
        <SecondLevelNavigation>
          <SecondLevelNavigationItem
            icon="lib_kubernetes_summary"
            label={t('in-forge:plugins.oTelK8sNode.dashboard.summary')}
            isActive={activeTab === TABS.SUMMARY}
            onClick={() => handleTabChange(TABS.SUMMARY)}
          />
          <SecondLevelNavigationItem
            icon="lib_kubernetes_pod"
            label={t('in-forge:plugins.oTelK8sNode.dashboard.pods')}
            isActive={activeTab === TABS.PODS}
            onClick={() => handleTabChange(TABS.PODS)}
          />
        </SecondLevelNavigation>
      </DashboardHeaderModule>
      <div style={{ marginTop: '1rem' }}>
        <ContentComponent snapshot={snapshot} snapshotId={snapshotId} timeConfig={timeConfig} />
      </div>
    </div>
  ) : null;
}
export const SPECS = [AVAILABLE_SPECS.GAUGE, AVAILABLE_SPECS.HISTOGRAM, AVAILABLE_SPECS.SUM, AVAILABLE_SPECS.SUMMARY];
