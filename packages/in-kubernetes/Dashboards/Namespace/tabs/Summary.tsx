/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

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
// @ts-expect-error
import MissingK8sPermissions from 'in-kubernetes/Dashboards/commonComponents/MissingK8sPermissions';
// @ts-expect-error
import TopDeploymentsList from 'in-kubernetes/Dashboards/commonComponents/TopDeploymentsList';
// @ts-expect-error
import { TimeShiftAwareChartSelectorWithUrlState } from 'in-components/ChartSelectors';
// @ts-expect-error
import { getNamespaceDashboard, summaryTab } from 'in-kubernetes/navigation/paths';
// @ts-expect-error
import TopPodsList from 'in-kubernetes/Dashboards/commonComponents/TopPodsList';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import PodsChartPresenter from 'in-kubernetes/Dashboards/Pod/tabs/Summary/PodsChartPresenter';
// @ts-expect-error
import { isOpenshift } from 'in-kubernetes/clusterDistributions';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { blue } from 'in-custom-dashboards/widgets/BigNumber/comparisonColors';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
// @ts-expect-error
import { plugins } from 'in-forge/constants';
import { getChartGranularity } from 'in-stores/metric/metric';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { formatDuration } from 'in-services/formatters/date';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import theme from 'in-themes';
import { t } from 'in-i18n';

interface SummaryProps {
  timeConfig: TimeConfig;
  data: KubernetesNamespace;
}

export default function Summary({ timeConfig, data: namespace }: SummaryProps) {
  const timeShift = useTimeShiftConfig();

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
  const tagFilterExpression = toBackendQueryModel(andQuery(clusterTag, nsTag));
  const type = plugins.kubernetesNamespace;

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

  const comparisonColors = {
    comparisonDecreaseColor: blue.id,
    comparisonIncreaseColor: blue.id
  };

  const cpuResourcesTabId = 'cpuResources';
  const memoryResourcesTabId = 'memoryResources';
  const podTabId = 'pods';

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
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.cpuRequests')}
            formatter={resourceQuotaPercentage}
            config={{
              metricConfiguration: {
                metric: 'required_cpu_percentage',
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
            formatter={resourceQuotaPercentage}
            config={{
              metricConfiguration: {
                metric: 'limit_cpu_percentage',
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
            formatter={resourceQuotaPercentage}
            config={{
              metricConfiguration: {
                metric: 'required_mem_percentage',
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
            formatter={resourceQuotaPercentage}
            config={{
              metricConfiguration: {
                metric: 'limit_mem_percentage',
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
            formatter={resourceQuotaPercentage}
            config={{
              metricConfiguration: {
                metric: 'used_pods_percentage',
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
          <TimeShiftAwareChartSelectorWithUrlState
            cardTitle={t('in-kubernetes:dashboards.cpuResources')}
            tabs={[
              {
                id: 'cpuResources',
                label: t('in-kubernetes:dashboards.cpuResources')
              }
            ]}
            metrics={[
              {
                id: 'hardRequests',
                label: t('in-kubernetes:dashboards.hardRequests'),
                value: 'cap_requests_cpu',
                tab: cpuResourcesTabId,
                tabDefault: true
              },
              {
                id: 'usedRequests',
                label: t('in-kubernetes:dashboards.usedRequests'),
                value: 'cpuRequests',
                tab: cpuResourcesTabId
              },
              {
                id: 'hardLimits',
                label: t('in-kubernetes:dashboards.hardLimits'),
                value: 'cap_limits_cpu',
                tab: cpuResourcesTabId
              },
              {
                id: 'usedLimits',
                label: t('in-kubernetes:dashboards.usedLimits'),
                value: 'cpuLimits',
                tab: cpuResourcesTabId
              },
              {
                id: 'usage',
                label: t('in-kubernetes:dashboards.usage'),
                value: 'cpu.total_usage',
                tab: cpuResourcesTabId
              }
            ]}
            urlMatrixParamConfig={{ path: summaryTab, paramTab: 'cpuTab', paramMetric: 'cpuMetric' }}
          >
            <PodsChartPresenter
              metrics={[
                {
                  metric: 'cap_requests_cpu',
                  label: t('in-kubernetes:dashboards.hardRequests'),
                  color: hardRequests,
                  ...defaultMetricConfig
                },
                {
                  metric: 'cpuRequests',
                  label: t('in-kubernetes:dashboards.usedRequests'),
                  color: requests,
                  ...defaultMetricConfig,
                  ...isContainerMetric
                },
                {
                  metric: 'cap_limits_cpu',
                  label: t('in-kubernetes:dashboards.hardLimits'),
                  color: hardLimits,
                  ...defaultMetricConfig
                },
                {
                  metric: 'cpuLimits',
                  label: t('in-kubernetes:dashboards.usedLimits'),
                  color: limits,
                  ...defaultMetricConfig,
                  ...isContainerMetric
                },
                {
                  metric: 'cpu.total_usage',
                  label: t('in-kubernetes:dashboards.usage'),
                  color: usage,
                  ...defaultMetricConfig,
                  ...isContainerMetric
                }
              ]}
              title={t('in-kubernetes:dashboards.cpuResources')}
              colors={[hardRequests, requests, hardLimits, limits, usage]}
              formatter="number.detailed"
              tooltipFormatter={resourceQuotaNumber}
            />
          </TimeShiftAwareChartSelectorWithUrlState>
        </Col>
        <Col lg={4}>
          <TimeShiftAwareChartSelectorWithUrlState
            cardTitle={t('in-kubernetes:dashboards.memoryResources')}
            tabs={[
              {
                id: 'memoryResources',
                label: t('in-kubernetes:dashboards.memoryResources')
              }
            ]}
            metrics={[
              {
                id: 'hardRequests',
                label: t('in-kubernetes:dashboards.hardRequests'),
                value: 'cap_requests_memory',
                tab: memoryResourcesTabId,
                tabDefault: true
              },
              {
                id: 'usedRequests',
                label: t('in-kubernetes:dashboards.usedRequests'),
                value: 'memoryRequests',
                tab: memoryResourcesTabId
              },
              {
                id: 'hardLimits',
                label: t('in-kubernetes:dashboards.hardLimits'),
                value: 'cap_limits_memory',
                tab: memoryResourcesTabId
              },
              {
                id: 'usedLimits',
                label: t('in-kubernetes:dashboards.usedLimits'),
                value: 'memoryLimits',
                tab: memoryResourcesTabId
              },
              {
                id: 'usage',
                label: t('in-kubernetes:dashboards.usage'),
                value: 'memory.usage',
                tab: memoryResourcesTabId
              }
            ]}
            urlMatrixParamConfig={{ path: summaryTab, paramTab: 'memoryTab', paramMetric: 'memoryMetric' }}
          >
            <PodsChartPresenter
              metrics={[
                {
                  metric: 'cap_requests_memory',
                  label: t('in-kubernetes:dashboards.hardRequests'),
                  color: hardRequests,
                  ...defaultMetricConfig
                },
                {
                  metric: 'memoryRequests',
                  label: t('in-kubernetes:dashboards.usedRequests'),
                  color: requests,
                  ...defaultMetricConfig,
                  ...isContainerMetric
                },
                {
                  metric: 'cap_limits_memory',
                  label: t('in-kubernetes:dashboards.hardLimits'),
                  color: hardLimits,
                  ...defaultMetricConfig
                },
                {
                  metric: 'memoryLimits',
                  label: t('in-kubernetes:dashboards.usedLimits'),
                  color: limits,
                  ...defaultMetricConfig,
                  ...isContainerMetric
                },
                {
                  metric: 'memory.usage',
                  label: t('in-kubernetes:dashboards.usage'),
                  color: usage,
                  ...defaultMetricConfig,
                  ...isContainerMetric
                }
              ]}
              title={t('in-kubernetes:dashboards.memoryResources')}
              colors={[hardRequests, requests, hardLimits, limits, usage]}
              formatter="bytes.detailed"
              tooltipFormatter={resourceQuotaBytes}
            />
          </TimeShiftAwareChartSelectorWithUrlState>
        </Col>
        <Col lg={4}>
          <TimeShiftAwareChartSelectorWithUrlState
            cardTitle={t('in-kubernetes:dashboards.pods')}
            tabs={[
              {
                id: 'pods',
                label: t('in-kubernetes:dashboards.pods')
              }
            ]}
            metrics={[
              {
                id: 'used',
                label: t('in-kubernetes:dashboards.used'),
                value: 'pods.count',
                tab: podTabId,
                tabDefault: true
              },
              {
                id: 'hard',
                label: t('in-kubernetes:dashboards.hard'),
                value: 'cap_pods',
                tab: podTabId
              }
            ]}
            urlMatrixParamConfig={{ path: summaryTab, paramTab: 'podTab', paramMetric: 'podMetric' }}
          >
            <PodsChartPresenter
              metrics={[
                {
                  metric: 'pods.count',
                  label: t('in-kubernetes:dashboards.used'),
                  color: pods,
                  ...defaultMetricConfig,
                  ...isContainerMetric
                },
                {
                  metric: 'cap_pods',
                  label: t('in-kubernetes:dashboards.hard'),
                  color: hardLimits,
                  ...defaultMetricConfig
                }
              ]}
              title={t('in-kubernetes:dashboards.pods')}
              colors={[pods, hardLimits]}
              formatter="number.compact"
              tooltipFormatter={resourceQuotaZeroDecimalPlaces}
            />
          </TimeShiftAwareChartSelectorWithUrlState>
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
            showDeploymentConfigs={isOpenshift(namespace.clusterDistribution || 'kubernetes')}
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
