/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { get } from 'lodash';
import React from 'react';

import { Card } from '@instana/components';

import {
  kubernetesClusterTagEquals,
  LogsChartInteractionWrapper,
  andQuery,
  kubernetesNamespaceTagEquals
} from 'in-kubernetes/Dashboards/commonComponents/LogsChartInteractionWrapper';
import {
  resourceQuotaPercentage,
  resourceQuotaNumber,
  resourceQuotaBytes,
  resourceQuotaZeroDecimalPlaces
} from 'in-kubernetes/formatters';
import MissingK8sPermissions from 'in-kubernetes/Dashboards/commonComponents/MissingK8sPermissions';
import TopDeploymentsList from 'in-kubernetes/Dashboards/commonComponents/TopDeploymentsList';
import MetricFilterChart from 'in-kubernetes/Dashboards/commonComponents/MetricFilterChart';
import K8DashboardsMarkerLanes from 'in-kubernetes/Dashboards/K8DashboardsMarkerLanes';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import TopPodsList from 'in-kubernetes/Dashboards/commonComponents/TopPodsList';
import InfraMetricKpiCard from 'in-components/KpiCard/InfraMetricKpiCard';
import { useNamespaceDashboard } from 'in-kubernetes/navigation/paths';
import { isOpenshift } from 'in-kubernetes/clusterDistributions';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { formatDuration } from 'in-services/formatters/date';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import oldTheme from 'in-themes';
import { t } from 'in-i18n';

const resourceQuotaSet = v => v !== -1;

export default function SummaryWithoutTimeShift({ timeConfig, data: namespace }) {
  const snapshotId = namespace.id;

  const hardLimits = oldTheme.lib.colors.chart.fiveColorPalette[2];
  const hardRequests = oldTheme.lib.colors.chart.fiveColorPalette[0];
  const limits = oldTheme.lib.colors.chart.fiveColorPalette[3];
  const requests = oldTheme.lib.colors.chart.fiveColorPalette[1];
  const usage = oldTheme.lib.colors.chart.fiveColorPalette[4];
  const pods = oldTheme.lib.colors.chart.strokeColors100[0];

  const clusterTag = kubernetesClusterTagEquals(namespace.clusterName);
  const nsTag = kubernetesNamespaceTagEquals(namespace.label);

  const allDeploymentsHrefs = useNamespaceDashboard(namespace.id, {
    tab: '/deployments'
  });

  const allDeploymentsConfigsHrefs = useNamespaceDashboard(namespace.id, {
    tab: '/deploymentconfigs'
  });

  const allPodsHrefs = useNamespaceDashboard(namespace.id, {
    tab: '/pods'
  });

  return (
    <>
      <MissingK8sPermissions resourceSnapshotId={namespace.id} timeConfig={timeConfig} />

      <KpiGridRow sizes={[6, 6]}>
        <KpiCard title={t('in-kubernetes:dashboards.status')} value={namespace.status} raw borderless />
        <KpiCard
          title={t('in-kubernetes:dashboards.age')}
          value={namespace.age}
          renderValue={formatDuration}
          raw
          borderless
        />
      </KpiGridRow>

      <Row>
        <Col lg={2}>
          <InfraMetricKpiCard
            title={t('in-kubernetes:dashboards.cpuRequests')}
            snapshotId={snapshotId}
            metric="required_cpu_percentage"
            formatter={resourceQuotaPercentage}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title={t('in-kubernetes:dashboards.cpuLimitsAlloc')}
            snapshotId={snapshotId}
            metric="limit_cpu_percentage"
            formatter={resourceQuotaPercentage}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title={t('in-kubernetes:dashboards.memoryRequests')}
            snapshotId={snapshotId}
            metric="required_mem_percentage"
            formatter={resourceQuotaPercentage}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title={t('in-kubernetes:dashboards.memoryLimitsAlloc')}
            snapshotId={snapshotId}
            metric="limit_mem_percentage"
            formatter={resourceQuotaPercentage}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title={t('in-kubernetes:dashboards.podsAlloc')}
            snapshotId={snapshotId}
            metric="used_pods_percentage"
            formatter={resourceQuotaPercentage}
          />
        </Col>
      </Row>

      <Row verticallyStretchColumns>
        <Col lg={4}>
          <Card title={t('in-kubernetes:dashboards.cpuResources')} useMaxAvailableHeight>
            <MetricFilterChart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              filterMetrics={['cap_requests_cpu', 'cap_limits_cpu']}
              filter={resourceQuotaSet}
              filterReasons={[
                t('in-kubernetes:dashboards.noCpuRequestQuotaMessage'),
                t('in-kubernetes:dashboards.noCpuLimitQuotaMessage')
              ]}
              chartComponent={Chart}
              y1={{
                formatter: resourceQuotaNumber,
                metrics: ['cap_requests_cpu', 'cpuRequests', 'cap_limits_cpu', 'cpuLimits', 'cpu.total_usage'].filter(
                  Boolean
                ),
                labels: [
                  t('in-kubernetes:dashboards.hardRequests'),
                  t('in-kubernetes:dashboards.usedRequests'),
                  t('in-kubernetes:dashboards.hardLimits'),
                  t('in-kubernetes:dashboards.usedLimits'),
                  t('in-kubernetes:dashboards.usage')
                ].filter(Boolean),
                type: 'line',
                min: 0,
                colors: [hardRequests, requests, hardLimits, limits, usage]
              }}
              renderPostChartContent={K8DashboardsMarkerLanes}
              minRollup={10000}
            />
          </Card>
        </Col>
        <Col lg={4}>
          <Card title={t('in-kubernetes:dashboards.memoryResources')} useMaxAvailableHeight>
            <MetricFilterChart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              filterMetrics={['cap_requests_memory', 'cap_limits_memory']}
              filter={resourceQuotaSet}
              filterReasons={[
                t('in-kubernetes:dashboards.noMemoryRequestQuotaMessage'),
                t('in-kubernetes:dashboards.noMemoryLimitQuotaMessage')
              ]}
              chartComponent={Chart}
              y1={{
                formatter: resourceQuotaBytes,
                metrics: [
                  'cap_requests_memory',
                  'memoryRequests',
                  'cap_limits_memory',
                  'memoryLimits',
                  'memory.usage'
                ].filter(Boolean),
                labels: [
                  t('in-kubernetes:dashboards.hardRequests'),
                  t('in-kubernetes:dashboards.usedRequests'),
                  t('in-kubernetes:dashboards.hardLimits'),
                  t('in-kubernetes:dashboards.usedLimits'),
                  t('in-kubernetes:dashboards.usage')
                ].filter(Boolean),
                type: 'line',
                min: 0,
                colors: [hardRequests, requests, hardLimits, limits, usage]
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
                formatter: resourceQuotaZeroDecimalPlaces,
                metrics: ['pods.count', 'cap_pods'],
                labels: [t('in-kubernetes:dashboards.used'), t('in-kubernetes:dashboards.hard')],
                type: 'line',
                min: 0,
                colors: [pods, hardLimits]
              }}
              renderPostChartContent={K8DashboardsMarkerLanes}
              minRollup={10000}
            />
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <LogsChartInteractionWrapper tagFilterExpression={andQuery(clusterTag, nsTag)} timeConfig={timeConfig} />
        </Col>
      </Row>

      <Row verticallyStretchColumns>
        <Col lg={6}>
          <TopDeploymentsList
            namespaceId={namespace.id}
            timeConfig={timeConfig}
            allItemsHrefs={{
              deployments: allDeploymentsHrefs,
              deploymentConfigs: allDeploymentsConfigsHrefs
            }}
            showDeploymentConfigs={isOpenshift(get(namespace, ['clusterDistribution'], 'kubernetes'))}
          />
        </Col>
        <Col lg={6}>
          <TopPodsList namespaceId={namespace.id} timeConfig={timeConfig} allItemsHref={allPodsHrefs} />
        </Col>
      </Row>
    </>
  );
}
