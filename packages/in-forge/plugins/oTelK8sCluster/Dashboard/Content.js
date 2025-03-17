/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from '@instana/components';
import { useObservable } from '@instana/hooks';

//import { fixedTimestamp } from 'in-test/util/generateMetrics';
import { pendingResult } from 'in-services/fixedObjects';
import DashboardHeaderModule, { themes } from 'in-components/DashboardHeader/DashboardHeaderModule';
import CustomMetricsV2, { AVAILABLE_SPECS } from 'in-sdk/components/dashboard/CustomMetricsV2';
import getOtelKubernetesContainers from 'in-subscription/getOtelKubernetesContainers';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import Containers from 'in-forge/plugins/oTelK8sCluster/Dashboard/Containers';
import getOtelKubernetesNodes from 'in-subscription/getOtelKubernetesNodes';
import getOtelKubernetesPods from 'in-subscription/getOtelKubernetesPods';
import Nodes from 'in-forge/plugins/oTelK8sCluster/Dashboard/Nodes';
import { openTelemetryKubernetes } from 'in-services/featureFlags';
import Pods from 'in-forge/plugins/oTelK8sCluster/Dashboard/Pods';
import { positiveNumber } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { minutes } from 'in-services/time';
import { t } from 'in-i18n';

export default function OTelK8SClusterDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const [activeTab, setActiveTab] = useState('summary');
  const TABS = {
    SUMMARY: 'summary',
    NODES: 'nodes',
    PODS: 'pods',
    CONTAINERS: 'containers'
  };

  const handleTabChange = tab => {
    setActiveTab(tab);
  };

  const otelNodes =
    useObservable(
      getOtelKubernetesNodes({
        pagination: {
          page: 1,
          pageSize: snapshot.get('nodecount') || 10
        },
        order: {
          by: 'id',
          direction: 'DESC'
        },
        filter: {
          clusterId: snapshotId,
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
  const otelPods =
    useObservable(
      getOtelKubernetesPods({
        pagination: {
          page: 1,
          pageSize: snapshot.get('podcount') || 10
        },
        order: {
          by: 'id',
          direction: 'DESC'
        },
        filter: {
          clusterId: snapshotId,
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

  const otelContainers =
    useObservable(
      getOtelKubernetesContainers({
        pagination: {
          page: 1,
          pageSize: snapshot.get('containercount') || 10
        },
        order: {
          by: 'id',
          direction: 'DESC'
        },
        filter: {
          clusterId: snapshotId,
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

  const SummaryContent = () => (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.oTelK8sCluster.dashboard.nodecount')}>
          <MetricValue initialValue={otelNodes?.data?.items?.length || 0} formatter={positiveNumber} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.oTelK8sCluster.dashboard.podcount')}>
          <MetricValue initialValue={otelPods?.data?.items?.length || 0} formatter={positiveNumber} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.oTelK8sCluster.dashboard.containercount')}>
          <MetricValue initialValue={otelContainers?.data?.items?.length || 0} formatter={positiveNumber} />
        </KpiKeyValue>
      </KpiSection>
      <CustomMetricsV2
        snapshot={snapshot}
        timeConfig={timeConfig}
        titlePrefix={t('in-forge:plugins.oTelK8sNode.type')}
        specs={SPECS}
      />
    </div>
  );

  const NodesContent = () => (
    <div>
      <Nodes nodes={otelNodes?.data?.items || []} renderByDashboard />
    </div>
  );

  const PodsContent = () => (
    <div>
      <Pods pods={otelPods?.data?.items || []} renderByDashboard />
    </div>
  );

  const ContainersContent = () => (
    <div>
      <Containers containers={otelContainers?.data?.items || []} renderByDashboard />
    </div>
  );

  const CONTENT_MAP = {
    summary: SummaryContent,
    nodes: NodesContent,
    pods: PodsContent,
    containers: ContainersContent
  };

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
            label={t('in-forge:plugins.oTelK8sCluster.dashboard.summary')}
            isActive={activeTab === TABS.SUMMARY}
            onClick={() => handleTabChange(TABS.SUMMARY)}
          />
          <SecondLevelNavigationItem
            icon="lib_kubernetes_node"
            label={t('in-forge:plugins.oTelK8sCluster.dashboard.nodes')}
            isActive={activeTab === TABS.NODES}
            onClick={() => handleTabChange(TABS.NODES)}
          />
          <SecondLevelNavigationItem
            icon="lib_kubernetes_pod"
            label={t('in-forge:plugins.oTelK8sCluster.dashboard.pods')}
            isActive={activeTab === TABS.PODS}
            onClick={() => handleTabChange(TABS.PODS)}
          />
          <SecondLevelNavigationItem
            icon="lib_kubernetes_container"
            label={t('in-forge:plugins.oTelK8sCluster.dashboard.containers')}
            isActive={activeTab === TABS.CONTAINERS}
            onClick={() => handleTabChange(TABS.CONTAINERS)}
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
