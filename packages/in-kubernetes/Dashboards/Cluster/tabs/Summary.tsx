/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { get } from 'lodash';
import React from 'react';

import { AggregationType, KubernetesCluster, ResultType, TimeConfig } from '@instana/types';

import {
  andQuery,
  LogsChartInteractionWrapper,
  tagEquals
} from 'in-kubernetes/Dashboards/commonComponents/LogsChartInteractionWrapper';
// @ts-expect-error
import { source } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/metrics';
import KubernetesTimeShiftChartPresenter from 'in-kubernetes/Dashboards/commonComponents/KubernetesTimeShiftChartPresenter';
// @ts-expect-error
import MissingK8sPermissions from 'in-kubernetes/Dashboards/commonComponents/MissingK8sPermissions';
import { bytesTwoDecimalPlaces, percentage, twoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
// @ts-expect-error
import TopDeploymentsList from 'in-kubernetes/Dashboards/commonComponents/TopDeploymentsList';
// @ts-expect-error
import TopNamespacesList from 'in-kubernetes/Dashboards/commonComponents/TopNamespacesList';
// @ts-expect-error
import TopNodesList from 'in-kubernetes/Dashboards/commonComponents/TopNodesList';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { k8sChartColors, k8sClusterChart } from 'in-kubernetes/components/K8sChartColors';
// @ts-expect-error
import { isOpenshift } from 'in-kubernetes/clusterDistributions';
import { summaryTab, useClusterDashboard } from 'in-kubernetes/navigation/paths';
import { useGetK8sEntityUid } from 'in-kubernetes/Dashboards/useGetK8sEntityUid';
import { blue } from 'in-custom-dashboards/widgets/BigNumber/comparisonColors';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import { k8sClusterUsageEnabled } from 'in-services/featureFlags';
import { Metric } from 'in-custom-dashboards/widgets/Chart/types';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { getChartGranularity } from 'in-stores/metric';
import { Col, Row } from 'in-components/layout/Grid';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

const showUsage = k8sClusterUsageEnabled;
interface SummaryProps {
  data: KubernetesCluster;
  timeConfig: TimeConfig;
}

export default function Summary({ timeConfig, data: cluster }: SummaryProps) {
  const timeShift = useTimeShiftConfig();
  const snapshotId = cluster.id;

  const { tagFilterExpression: logsChartQuery } = useGetK8sEntityUid('kubernetes.cluster', snapshotId, timeConfig);

  const { running, limits, requests, usage } = k8sChartColors;
  const { pending, capacity, allocated } = k8sClusterChart;

  const comparisonColors = {
    comparisonDecreaseColor: blue.id,
    comparisonIncreaseColor: blue.id
  };

  const clusterTagId = tagEquals('id.kubernetesCluster', snapshotId);
  const tagFilterExpression = toBackendQueryModel(andQuery(clusterTagId));
  const type = plugins.kubernetesCluster;

  const defaultBigNumberMetricConfig = {
    source,
    aggregation: 'MEAN' as AggregationType,
    tagFilterExpression,
    type,
    timeShift,
    timeConfig,
    resultType: 'SINGLE_NUMBER' as ResultType
  };

  const defaultMetricConfig = {
    granularity: getChartGranularity(timeConfig),
    aggregation: 'MEAN' as AggregationType,
    source,
    tagFilterExpression,
    timeConfig,
    timeShift: 0,
    type
  };

  const isContainerMetric = {
    /* use this configuration on containers of this pod (which can be of type docker, containerd or crio)
      type filtering must be disabled and cross series aggregation uses SUM */
    type: undefined,
    crossSeriesAggregation: 'SUM' as AggregationType
  };

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

  function addUsageToMetrics(metricsArr: Metric[], metric: Metric) {
    if (showUsage) {
      metricsArr.push(metric);
      return metricsArr;
    } else {
      return metricsArr;
    }
  }

  return (
    <>
      <MissingK8sPermissions cluster={cluster} />
      <Row>
        <Col lg={2}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.cpuRequests')}
            formatter={percentage.detailed}
            config={{
              metricConfiguration: {
                metric: 'requiredCapacityCPURatio',
                ...defaultBigNumberMetricConfig
              },
              ...comparisonColors
            }}
            raw
          />
        </Col>
        <Col lg={2}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.cpuLimitsAlloc')}
            formatter={percentage.detailed}
            config={{
              metricConfiguration: {
                metric: 'limitCapacityCPURatio',
                ...defaultBigNumberMetricConfig
              },
              ...comparisonColors
            }}
            raw
          />
        </Col>
        <Col lg={2}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.memoryRequests')}
            formatter={percentage.detailed}
            config={{
              metricConfiguration: {
                metric: 'requiredCapacityMemoryRatio',
                ...defaultBigNumberMetricConfig
              },
              ...comparisonColors
            }}
            raw
          />
        </Col>
        <Col lg={2}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.memoryLimitsAlloc')}
            formatter={percentage.detailed}
            config={{
              metricConfiguration: {
                metric: 'limitCapacityMemoryRatio',
                ...defaultBigNumberMetricConfig
              },
              ...comparisonColors
            }}
            raw
          />
        </Col>
        <Col lg={2}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.podsAlloc')}
            formatter={percentage.detailed}
            config={{
              metricConfiguration: {
                metric: 'allocatedCapacityPodsRatio',
                ...defaultBigNumberMetricConfig
              },
              ...comparisonColors
            }}
            raw
          />
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={4}>
          <KubernetesTimeShiftChartPresenter
            metrics={addUsageToMetrics(
              [
                {
                  metric: 'requiredCPU',
                  label: t('in-kubernetes:dashboards.requests'),
                  color: requests,
                  ...defaultMetricConfig,
                  ...isContainerMetric
                },
                {
                  metric: 'limitCPU',
                  label: t('in-kubernetes:dashboards.limits'),
                  color: limits,
                  ...defaultMetricConfig
                },
                {
                  metric: 'nodes.capacity_cpu',
                  label: t('in-kubernetes:dashboards.capacity'),
                  color: capacity,
                  ...defaultMetricConfig
                }
              ],
              {
                metric: 'cpu.total_usage',
                label: t('in-kubernetes:dashboards.usage'),
                color: usage,
                ...defaultMetricConfig
              }
            )}
            title={t('in-kubernetes:dashboards.cpuResources')}
            colors={[requests, limits, capacity, usage]}
            formatter="number.compact"
            tooltipFormatter={twoDecimalPlaces}
            paramTab="cpuTab"
            paramMetric="cpuMetric"
            path={summaryTab}
            hasActionlane
            snapshotId={snapshotId}
            hasButtonInActionslane={false}
          />
        </Col>
        <Col lg={4}>
          <KubernetesTimeShiftChartPresenter
            metrics={addUsageToMetrics(
              [
                {
                  metric: 'requiredMemory',
                  label: t('in-kubernetes:dashboards.requests'),
                  color: requests,
                  ...defaultMetricConfig,
                  ...isContainerMetric
                },
                {
                  metric: 'limitMemory',
                  label: t('in-kubernetes:dashboards.limits'),
                  color: limits,
                  ...defaultMetricConfig
                },
                {
                  metric: 'nodes.capacity_mem',
                  label: t('in-kubernetes:dashboards.capacity'),
                  color: capacity,
                  ...defaultMetricConfig
                }
              ],
              {
                metric: 'memory.usage',
                label: t('in-kubernetes:dashboards.usage'),
                color: usage,
                ...defaultMetricConfig
              }
            )}
            title={t('in-kubernetes:dashboards.memoryResources')}
            colors={[requests, limits, capacity, usage]}
            formatter="bytes.detailed"
            tooltipFormatter={bytesTwoDecimalPlaces}
            paramTab="memTab"
            paramMetric="memMetric"
            path={summaryTab}
            hasActionlane
            snapshotId={snapshotId}
            hasButtonInActionslane={false}
          />
        </Col>
        <Col lg={4}>
          <KubernetesTimeShiftChartPresenter
            metrics={[
              {
                metric: 'podsRunning',
                label: t('in-kubernetes:dashboards.running'),
                color: running,
                ...defaultMetricConfig,
                ...isContainerMetric
              },
              {
                metric: 'podsPending',
                label: t('in-kubernetes:dashboards.pending'),
                color: pending,
                ...defaultMetricConfig
              },
              {
                metric: 'pods.count',
                label: t('in-kubernetes:dashboards.allocated'),
                color: allocated,
                ...defaultMetricConfig
              },
              {
                metric: 'nodes.capacity_pods',
                label: t('in-kubernetes:dashboards.capacity'),
                color: capacity,
                ...defaultMetricConfig
              }
            ]}
            title={t('in-kubernetes:dashboards.pods')}
            colors={[running, pending, allocated, capacity]}
            formatter="number.compact"
            tooltipFormatter={zeroDecimalPlaces}
            paramTab="podTab"
            paramMetric="podMetric"
            path={summaryTab}
            hasActionlane
            snapshotId={snapshotId}
            hasButtonInActionslane={false}
          />
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
