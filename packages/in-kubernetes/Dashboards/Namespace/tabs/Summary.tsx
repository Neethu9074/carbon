/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';

import { KubernetesNamespace, TimeConfig } from '@instana/types';
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
// @ts-expect-error
import MissingK8sPermissions from 'in-kubernetes/Dashboards/commonComponents/MissingK8sPermissions';
// @ts-expect-error
import TopDeploymentsList from 'in-kubernetes/Dashboards/commonComponents/TopDeploymentsList';
// @ts-expect-error
import MetricFilterChart from 'in-kubernetes/Dashboards/commonComponents/MetricFilterChart';
// @ts-expect-error
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
// @ts-expect-error
import TopPodsList from 'in-kubernetes/Dashboards/commonComponents/TopPodsList';
// @ts-expect-error
import InfraMetricKpiCard from 'in-components/KpiCard/InfraMetricKpiCard';
// @ts-expect-error
import { getNamespaceDashboard } from 'in-kubernetes/navigation/paths';
import K8DashboardsMarkerLanes from 'in-kubernetes/Dashboards/K8DashboardsMarkerLanes';
// @ts-expect-error
import { isOpenshift } from 'in-kubernetes/clusterDistributions';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { formatDuration } from 'in-services/formatters/date';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import theme from 'in-themes';
import { t } from 'in-i18n';

const resourceQuotaSet = (v: number) => v !== -1;

interface SummaryProps {
  timeConfig: TimeConfig;
  data: KubernetesNamespace;
}

export default function Summary({ timeConfig, data: namespace }: SummaryProps) {
  const snapshotId = namespace.id;
  const {
    indigo800: hardLimits,
    purple800: hardRequests,
    orange800: limits,
    lime800: requests,
    slushGreen800: pods,
    lightBlue800: usage
  } = theme.lib.colors;

  const clusterTag = kubernetesClusterTagEquals(namespace.clusterName);
  const nsTag = kubernetesNamespaceTagEquals(namespace.label);

  return (
    <Fragment>
      <MissingK8sPermissions resourceSnapshotId={namespace.id} timeConfig={timeConfig} />

      <KpiGridRow sizes={[6, 6]}>
        <KpiCard title={t('in-kubernetes:dashboards.status')} value={namespace.status} raw borderless />
        <KpiCard
          title={t('in-kubernetes:dashboards.age')}
          value={namespace.age ? formatDuration(namespace.age) : valueMissingPlaceholder}
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
            allItemsHrefs$={{
              deployments: getNamespaceDashboard(namespace.id, {
                tab: '/deployments'
              }),
              deploymentConfigs: getNamespaceDashboard(namespace.id, {
                tab: '/deploymentconfigs'
              })
            }}
            showDeploymentConfigs={isOpenshift(get(namespace, ['clusterDistribution'], 'kubernetes'))}
          />
        </Col>
        <Col lg={6}>
          <TopPodsList
            namespaceId={namespace.id}
            timeConfig={timeConfig}
            allItemsHref$={getNamespaceDashboard(namespace.id, {
              tab: '/pods'
            })}
          />
        </Col>
      </Row>
    </Fragment>
  );
}
