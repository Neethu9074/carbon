/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { get } from 'lodash';
import React from 'react';

import { Card } from '@instana/components';

import { bytesTwoDecimalPlaces, percentage, twoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import { LogsChartInteractionWrapper } from 'in-kubernetes/Dashboards/commonComponents/LogsChartInteractionWrapper';
import MissingK8sPermissions from 'in-kubernetes/Dashboards/commonComponents/MissingK8sPermissions';
import TopDeploymentsList from 'in-kubernetes/Dashboards/commonComponents/TopDeploymentsList';
import TopNamespacesList from 'in-kubernetes/Dashboards/commonComponents/TopNamespacesList';
import { k8sChartColors, k8sClusterChart } from 'in-kubernetes/components/K8sChartColors';
import K8DashboardsMarkerLanes from 'in-kubernetes/Dashboards/K8DashboardsMarkerLanes';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import TopNodesList from 'in-kubernetes/Dashboards/commonComponents/TopNodesList';
import { useGetK8sEntityUid } from 'in-kubernetes/Dashboards/useGetK8sEntityUid';
import InfraMetricKpiCard from 'in-components/KpiCard/InfraMetricKpiCard';
import { useClusterDashboard } from 'in-kubernetes/navigation/paths';
import { k8sClusterUsageEnabled } from 'in-services/featureFlags';
import { isOpenshift } from 'in-kubernetes/clusterDistributions';
import { Col, Row } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

const showUsage = k8sClusterUsageEnabled;

export default function Summary({ timeConfig, data: cluster }) {
  const snapshotId = cluster.id;

  const { running, limits, requests, usage } = k8sChartColors;
  const { pending, capacity, allocated } = k8sClusterChart;

  const { tagFilterExpression: logsChartQuery } = useGetK8sEntityUid('kubernetes.cluster', snapshotId, timeConfig);

  const allItemsNodesHrefs = useClusterDashboard(cluster.id, {
    tab: '/nodes'
  });

  const allItemsNamespacesHrefs = useClusterDashboard(cluster.id, {
    tab: '/namespaces'
  });

  const allItemsDeploymentsHrefs = useClusterDashboard(cluster.id, {
    tab: '/deployments'
  });

  const allItemsDeploymentsConfigsHrefs = useClusterDashboard(cluster.id, {
    tab: '/deploymentconfigs'
  });

  return (
    <>
      <MissingK8sPermissions cluster={cluster} />
      <Row>
        <Col lg={2}>
          <InfraMetricKpiCard
            title={t('in-kubernetes:dashboards.cpuRequests')}
            snapshotId={snapshotId}
            metric="requiredCapacityCPURatio"
            formatter={percentage.detailed}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title={t('in-kubernetes:dashboards.cpuLimitsAlloc')}
            snapshotId={snapshotId}
            metric="limitCapacityCPURatio"
            formatter={percentage.detailed}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title={t('in-kubernetes:dashboards.memoryRequests')}
            snapshotId={snapshotId}
            metric="requiredCapacityMemoryRatio"
            formatter={percentage.detailed}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title={t('in-kubernetes:dashboards.memoryLimitsAlloc')}
            snapshotId={snapshotId}
            metric="limitCapacityMemoryRatio"
            formatter={percentage.detailed}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title={t('in-kubernetes:dashboards.podsAlloc')}
            snapshotId={snapshotId}
            metric="allocatedCapacityPodsRatio"
            formatter={percentage.detailed}
          />
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={4}>
          <Card title={t('in-kubernetes:dashboards.cpuResources')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: twoDecimalPlaces,
                metrics: ['requiredCPU', 'limitCPU', 'nodes.capacity_cpu', showUsage && 'cpu.total_usage'].filter(
                  Boolean
                ),
                labels: [
                  t('in-kubernetes:dashboards.requests'),
                  t('in-kubernetes:dashboards.limits'),
                  t('in-kubernetes:dashboards.capacity'),
                  showUsage && t('in-kubernetes:dashboards.usage')
                ].filter(Boolean),
                type: 'line',
                colors: [requests, limits, capacity, usage]
              }}
              renderPostChartContent={K8DashboardsMarkerLanes}
              minRollup={10000}
            />
          </Card>
        </Col>
        <Col lg={4}>
          <Card title={t('in-kubernetes:dashboards.memoryResources')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: bytesTwoDecimalPlaces,
                metrics: ['requiredMemory', 'limitMemory', 'nodes.capacity_mem', showUsage && 'memory.usage'].filter(
                  Boolean
                ),
                labels: [
                  t('in-kubernetes:dashboards.requests'),
                  t('in-kubernetes:dashboards.limits'),
                  t('in-kubernetes:dashboards.capacity'),
                  showUsage && t('in-kubernetes:dashboards.usage')
                ].filter(Boolean),
                type: 'line',
                colors: [requests, limits, capacity, usage]
              }}
              renderPostChartContent={K8DashboardsMarkerLanes}
              minRollup={10000}
            />
          </Card>
        </Col>
        <Col lg={4}>
          <Card title={t('in-kubernetes:dashboards.pods')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: zeroDecimalPlaces,
                metrics: ['podsRunning', 'podsPending', 'pods.count', 'nodes.capacity_pods'],
                labels: [
                  t('in-kubernetes:dashboards.running'),
                  t('in-kubernetes:dashboards.pending'),
                  t('in-kubernetes:dashboards.allocated'),
                  t('in-kubernetes:dashboards.capacity')
                ],
                type: 'line',
                colors: [running, pending, allocated, capacity]
              }}
              renderPostChartContent={K8DashboardsMarkerLanes}
            />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <LogsChartInteractionWrapper tagFilterExpression={logsChartQuery} timeConfig={timeConfig} />
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={4}>
          <TopNodesList clusterId={cluster.id} timeConfig={timeConfig} allItemsHref={allItemsNodesHrefs} />
        </Col>
        <Col lg={4}>
          <TopNamespacesList clusterId={cluster.id} timeConfig={timeConfig} allItemsHref={allItemsNamespacesHrefs} />
        </Col>
        <Col lg={4}>
          <TopDeploymentsList
            clusterId={cluster.id}
            timeConfig={timeConfig}
            allItemsHrefs={{
              deployments: allItemsDeploymentsHrefs,
              deploymentConfigs: allItemsDeploymentsConfigsHrefs
            }}
            showDeploymentConfigs={isOpenshift(get(cluster, ['clusterDistribution'], 'kubernetes'))}
          />
        </Col>
      </Row>
    </>
  );
}
