/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { AggregationType, KubernetesNamespace, ResultType, TimeConfig } from '@instana/types';

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
import { source } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/metrics';
import KubernetesTimeShiftChartPresenter from 'in-kubernetes/Dashboards/commonComponents/KubernetesTimeShiftChartPresenter';
// @ts-expect-error
import MissingK8sPermissions from 'in-kubernetes/Dashboards/commonComponents/MissingK8sPermissions';
// @ts-expect-error
import TopDeploymentsList from 'in-kubernetes/Dashboards/commonComponents/TopDeploymentsList';
// @ts-expect-error
import TopPodsList from 'in-kubernetes/Dashboards/commonComponents/TopPodsList';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import MultiMetricBigNumberKpiCard from 'in-kubernetes/components/MultiMetricBigNumberKpiCard';
// @ts-expect-error
import { isOpenshift } from 'in-kubernetes/clusterDistributions';
import { useNamespaceDashboard, summaryTab } from 'in-kubernetes/navigation/paths';
import { blue } from 'in-custom-dashboards/widgets/BigNumber/comparisonColors';
import { getChartGranularity } from 'in-stores/metric/metric';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { formatDuration } from 'in-services/formatters/date';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import oldTheme, { useTheme } from 'in-themes';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

interface SummaryProps {
  timeConfig: TimeConfig;
  data: KubernetesNamespace;
}

export default function Summary({ timeConfig, data: namespace }: SummaryProps) {
  const theme = useTheme();
  const timeShift = useTimeShiftConfig();

  // Removing the old destructuring syntax for colors
  const hardLimits = theme.ids.color.option.indigo['500'];
  const hardRequests = theme.ids.color.option.purple['500'];
  const limits = theme.ids.color.option.orange['500'];
  const requests = theme.ids.color.option.lime['500'];
  const usage = theme.ids.color.option.blue['400'];
  const pods = oldTheme.lib.colors.slushGreen800; // We don't have any alternative ids color for slushGreen800 -- using oldTheme here

  const clusterTag = kubernetesClusterTagEquals(namespace.clusterName);
  const nsTag = kubernetesNamespaceTagEquals(namespace.label);
  const tagFilterExpression = toBackendQueryModel(andQuery(clusterTag, nsTag));
  const type = plugins.kubernetesNamespace;

  const defaultConfig = {
    source,
    type,
    aggregation: 'MEAN' as AggregationType,
    tagFilterExpression,
    timeConfig,
    timeShift
  };
  const defaultBigNumberMetricConfig = {
    ...defaultConfig,
    resultType: 'SINGLE_NUMBER' as ResultType
  };

  const defaultChartMetricConfig = {
    ...defaultConfig,
    granularity: getChartGranularity(timeConfig)
  };

  const isContainerMetric = {
    /* use this configuration on containers of this pod (which can be of type docker, containerd or crio)
      type filtering must be disabled and cross series aggregation uses SUM */
    type: undefined,
    crossSeriesAggregation: 'SUM' as AggregationType
  };

  const isPodCountMetric = {
    type: plugins.kubernetesPod,
    crossSeriesAggregation: 'DISTINCT_COUNT' as AggregationType
  };

  const comparisonColors = {
    comparisonDecreaseColor: blue.id,
    comparisonIncreaseColor: blue.id
  };

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
          <MultiMetricBigNumberKpiCard
            title={t('in-kubernetes:dashboards.cpuRequestsMultiMetric')}
            formatter={[resourceQuotaNumber, resourceQuotaPercentage]}
            config={[
              {
                metricConfiguration: {
                  metric: 'cpuRequests',
                  ...defaultBigNumberMetricConfig,
                  ...isContainerMetric
                },
                ...comparisonColors
              },
              {
                metricConfiguration: {
                  metric: 'required_cpu_percentage',
                  ...defaultBigNumberMetricConfig
                },
                ...comparisonColors
              }
            ]}
            raw
          />
        </Col>
        <Col lg={2}>
          <MultiMetricBigNumberKpiCard
            title={t('in-kubernetes:dashboards.cpuLimitsAllocMultiMetric')}
            formatter={[resourceQuotaNumber, resourceQuotaPercentage]}
            config={[
              {
                metricConfiguration: {
                  metric: 'cpuLimits',
                  ...defaultBigNumberMetricConfig,
                  ...isContainerMetric
                },
                ...comparisonColors
              },
              {
                metricConfiguration: {
                  metric: 'limit_cpu_percentage',
                  ...defaultBigNumberMetricConfig
                },
                ...comparisonColors
              }
            ]}
            raw
          />
        </Col>
        <Col lg={2}>
          <MultiMetricBigNumberKpiCard
            title={t('in-kubernetes:dashboards.memoryRequestsMultiMetric')}
            formatter={[resourceQuotaBytes, resourceQuotaPercentage]}
            config={[
              {
                metricConfiguration: {
                  metric: 'memoryRequests',
                  ...defaultBigNumberMetricConfig,
                  ...isContainerMetric
                },
                ...comparisonColors
              },
              {
                metricConfiguration: {
                  metric: 'required_mem_percentage',
                  ...defaultBigNumberMetricConfig
                },
                ...comparisonColors
              }
            ]}
            raw
          />
        </Col>
        <Col lg={2}>
          <MultiMetricBigNumberKpiCard
            title={t('in-kubernetes:dashboards.memoryLimitsAllocMultiMetric')}
            formatter={[resourceQuotaBytes, resourceQuotaPercentage]}
            config={[
              {
                metricConfiguration: {
                  metric: 'memoryLimits',
                  ...defaultBigNumberMetricConfig,
                  ...isContainerMetric
                },
                ...comparisonColors
              },
              {
                metricConfiguration: {
                  metric: 'limit_mem_percentage',
                  ...defaultBigNumberMetricConfig
                },
                ...comparisonColors
              }
            ]}
            raw
          />
        </Col>
        <Col lg={2}>
          <MultiMetricBigNumberKpiCard
            title={t('in-kubernetes:dashboards.podsAllocMultiMetric')}
            formatter={[resourceQuotaZeroDecimalPlaces, resourceQuotaPercentage]}
            config={[
              {
                metricConfiguration: {
                  metric: 'pods.count',
                  ...defaultBigNumberMetricConfig,
                  ...isPodCountMetric
                },
                ...comparisonColors
              },
              {
                metricConfiguration: {
                  metric: 'used_pods_percentage',
                  ...defaultBigNumberMetricConfig
                },
                ...comparisonColors
              }
            ]}
            raw
          />
        </Col>
      </Row>

      <Row verticallyStretchColumns>
        <Col lg={4}>
          <KubernetesTimeShiftChartPresenter
            metrics={[
              {
                metric: 'cap_requests_cpu',
                label: t('in-kubernetes:dashboards.hardRequests'),
                color: hardRequests,
                ...defaultChartMetricConfig
              },
              {
                metric: 'cpuRequests',
                label: t('in-kubernetes:dashboards.usedRequests'),
                color: requests,
                ...defaultChartMetricConfig,
                ...isContainerMetric
              },
              {
                metric: 'cap_limits_cpu',
                label: t('in-kubernetes:dashboards.hardLimits'),
                color: hardLimits,
                ...defaultChartMetricConfig
              },
              {
                metric: 'cpuLimits',
                label: t('in-kubernetes:dashboards.usedLimits'),
                color: limits,
                ...defaultChartMetricConfig,
                ...isContainerMetric
              },
              {
                metric: 'cpu.total_usage',
                label: t('in-kubernetes:dashboards.usage'),
                color: usage,
                ...defaultChartMetricConfig,
                ...isContainerMetric
              }
            ]}
            title={t('in-kubernetes:dashboards.cpuResources')}
            colors={[hardRequests, requests, hardLimits, limits, usage]}
            formatter="number.detailed"
            tooltipFormatter={resourceQuotaNumber}
            paramTab="cpuTab"
            paramMetric="cpuMetric"
            path={summaryTab}
          />
        </Col>
        <Col lg={4}>
          <KubernetesTimeShiftChartPresenter
            metrics={[
              {
                metric: 'cap_requests_memory',
                label: t('in-kubernetes:dashboards.hardRequests'),
                color: hardRequests,
                ...defaultChartMetricConfig
              },
              {
                metric: 'memoryRequests',
                label: t('in-kubernetes:dashboards.usedRequests'),
                color: requests,
                ...defaultChartMetricConfig,
                ...isContainerMetric
              },
              {
                metric: 'cap_limits_memory',
                label: t('in-kubernetes:dashboards.hardLimits'),
                color: hardLimits,
                ...defaultChartMetricConfig
              },
              {
                metric: 'memoryLimits',
                label: t('in-kubernetes:dashboards.usedLimits'),
                color: limits,
                ...defaultChartMetricConfig,
                ...isContainerMetric
              },
              {
                metric: 'memory.usage',
                label: t('in-kubernetes:dashboards.usage'),
                color: usage,
                ...defaultChartMetricConfig,
                ...isContainerMetric
              }
            ]}
            title={t('in-kubernetes:dashboards.memoryResources')}
            colors={[hardRequests, requests, hardLimits, limits, usage]}
            formatter="bytes.detailed"
            tooltipFormatter={resourceQuotaBytes}
            paramTab="memoryTab"
            paramMetric="memoryMetric"
            path={summaryTab}
          />
        </Col>
        <Col lg={4}>
          <KubernetesTimeShiftChartPresenter
            metrics={[
              {
                metric: 'pods.count',
                label: t('in-kubernetes:dashboards.used'),
                color: pods,
                ...defaultChartMetricConfig,
                ...isPodCountMetric
              },
              {
                metric: 'cap_pods',
                label: t('in-kubernetes:dashboards.hard'),
                color: hardLimits,
                ...defaultChartMetricConfig
              }
            ]}
            title={t('in-kubernetes:dashboards.pods')}
            colors={[pods, hardLimits]}
            formatter="number.compact"
            tooltipFormatter={resourceQuotaZeroDecimalPlaces}
            paramTab="podTab"
            paramMetric="podMetric"
            path={summaryTab}
          />
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
            showDeploymentConfigs={isOpenshift(namespace.clusterDistribution || 'kubernetes')}
          />
        </Col>
        <Col lg={6}>
          <TopPodsList namespaceId={namespace.id} timeConfig={timeConfig} allItemsHref={allPodsHrefs} />
        </Col>
      </Row>
    </>
  );
}
