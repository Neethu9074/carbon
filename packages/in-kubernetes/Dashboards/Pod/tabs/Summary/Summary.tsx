/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { Fragment } from 'react';

import { AggregationType, KubernetesPod, ResultType, TimeConfig } from '@instana/types';
import { Card } from '@instana/components';

import {
  LogsChartInteractionWrapper,
  tagEquals,
  andQuery,
  kubernetesClusterTagEquals,
  kubernetesNamespaceTagEquals
} from 'in-kubernetes/Dashboards/commonComponents/LogsChartInteractionWrapper';
// @ts-expect-error
import { source } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/metrics';
// @ts-expect-error
import { TimeShiftAwareChartSelectorWithUrlState } from 'in-components/ChartSelectors/ChartSelectors';
// @ts-expect-error
import MissingK8sPermissions from 'in-kubernetes/Dashboards/commonComponents/MissingK8sPermissions';
// @ts-expect-error
import ConditionsTableCard from 'in-kubernetes/Dashboards/commonComponents/ConditionsTableCard';
// @ts-expect-error
import ContainerStates from 'in-kubernetes/Dashboards/Pod/tabs/Summary/ContainerStates';
import { zeroDecimalPlaces, twoDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
// @ts-expect-error
import { resourceQuotaBytes, resourceQuotaNumber } from 'in-kubernetes/formatters';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
// @ts-expect-error
import { getPodDashboard, summaryTab } from 'in-kubernetes/navigation/paths';
import PodsChartPresenter from 'in-kubernetes/Dashboards/Pod/tabs/Summary/PodsChartPresenter';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { blue } from 'in-custom-dashboards/widgets/BigNumber/comparisonColors';
// @ts-expect-error
import MetricValue from 'in-components/MetricValue';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
// @ts-expect-error
import { plugins } from 'in-forge/constants';
import { number, bytes } from 'in-services/formatters/number';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { formatDuration } from 'in-services/formatters/date';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
// @ts-ignore
import { plugins } from 'in-forge/constants';
import { getChartGranularity } from 'in-stores/metric';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import Capitalize from 'in-components/Capitalize';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './Summary.mless';

interface SummaryProps {
  data: KubernetesPod;
  timeConfig: TimeConfig;
}

export default function Summary({ data: pod, timeConfig }: SummaryProps) {
  const timeShift = useTimeShiftConfig();

  const containerStatuses = pod.status?.containerStatuses || [];
  const kpiWidth = 2;

  const clusterTag = kubernetesClusterTagEquals(pod.clusterId);
  const nsTag = kubernetesNamespaceTagEquals(pod.namespace);
  const podTag = tagEquals('kubernetes.pod.name', pod.label);
  const tagFilterExpression = toBackendQueryModel(andQuery(clusterTag, nsTag, podTag));
  const type = plugins.kubernetesPod;

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

  const { orange800: limits, lime800: requests, lightBlue800: usage } = theme.lib.colors;
  const comparisonColors = {
    comparisonDecreaseColor: blue.id,
    comparisonIncreaseColor: blue.id
  };

  const cpuResourcesTabId = 'cpuResources';
  const memoryResourcesTabId = 'memoryResources';

  return (
    <Fragment>
      <MissingK8sPermissions resourceSnapshotId={pod.id} timeConfig={timeConfig} />

      <KpiGridRow sizes={[3, 3, 2, 2, 2]}>
        <KpiCard
          title={t('in-kubernetes:dashboards.status')}
          value={<Capitalize>{pod.status?.statusSummary || valueMissingPlaceholder}</Capitalize>}
          borderless
          raw
        />
        <KpiCard
          title={t('in-kubernetes:dashboards.phase')}
          value={<Capitalize>{pod.status?.phase || valueMissingPlaceholder}</Capitalize>}
          borderless
          raw
        />
        <KpiCard
          title={t('in-kubernetes:dashboards.readySummary')}
          value={`${containerStatuses.filter(c => c.ready).length}/${containerStatuses.length}`}
          borderless
          raw
        />
        <KpiCard
          title={t('in-kubernetes:dashboards.restarts')}
          value={<MetricValue snapshotId={pod.id} metric="restartCount" formatter={zeroDecimalPlaces} />}
          borderless
          raw
        />
        <KpiCard
          title={t('in-kubernetes:dashboards.age')}
          value={pod.age ? formatDuration(pod.age) : valueMissingPlaceholder}
          borderless
          raw
        />
      </KpiGridRow>

      {pod.status?.message && (
        <Row>
          <Col lg={12}>
            <KpiCard
              title={t('in-kubernetes:dashboards.statusMessage')}
              valuesClassName={locals.message}
              value={pod.status?.message}
              raw
            />
          </Col>
        </Row>
      )}

      <Row>
        <Col lg={kpiWidth}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.cpuUsage')}
            formatter={twoDecimalPlaces}
            config={{
              metricConfiguration: {
                metric: 'cpu.total_usage',
                ...defaultBigNumberMetricConfig,
                ...isContainerMetric
              },
              ...comparisonColors
            }}
            raw
          />
        </Col>
        <Col lg={kpiWidth}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.cpuRequests')}
            formatter={resourceQuotaNumber}
            config={{
              metricConfiguration: {
                metric: 'cpuRequests',
                ...defaultBigNumberMetricConfig
              },
              ...comparisonColors
            }}
            raw
          />
        </Col>
        <Col lg={kpiWidth}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.cpuLimits')}
            formatter={resourceQuotaNumber}
            config={{
              metricConfiguration: {
                metric: 'cpuLimits',
                ...defaultBigNumberMetricConfig
              },
              ...comparisonColors
            }}
            raw
          />
        </Col>
        <Col lg={kpiWidth}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.memoryUsage')}
            formatter={bytesTwoDecimalPlaces}
            config={{
              metricConfiguration: {
                metric: 'memory.usage',
                ...defaultBigNumberMetricConfig,
                ...isContainerMetric
              },
              ...comparisonColors
            }}
            raw
          />
        </Col>
        <Col lg={kpiWidth}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.memoryRequests')}
            formatter={resourceQuotaBytes}
            config={{
              metricConfiguration: {
                metric: 'memoryRequests',
                ...defaultBigNumberMetricConfig
              },
              ...comparisonColors
            }}
            raw
          />
        </Col>
        <Col lg={kpiWidth}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.memoryLimits')}
            formatter={resourceQuotaBytes}
            config={{
              metricConfiguration: {
                metric: 'memoryLimits',
                ...defaultBigNumberMetricConfig
              },
              ...comparisonColors
            }}
            raw
          />
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <TimeShiftAwareChartSelectorWithUrlState
            cardTitle={t('in-kubernetes:labelCpuResources')}
            tabs={[
              {
                id: 'cpuResources',
                label: t('in-kubernetes:labelCpuResources')
              }
            ]}
            metrics={[
              {
                id: 'cpuUsage',
                label: t('in-kubernetes:dashboards.usage'),
                value: 'cpu.total_usage',
                tab: cpuResourcesTabId,
                tabDefault: true
              },
              {
                id: 'cpuRequests',
                label: t('in-kubernetes:dashboards.requests'),
                value: 'cpuRequests',
                tab: cpuResourcesTabId
              },
              {
                id: 'cpuLimits',
                label: t('in-kubernetes:dashboards.cpuLimits'),
                value: 'cpuLimits',
                tab: cpuResourcesTabId
              }
            ]}
            urlMatrixParamConfig={{ path: summaryTab, paramTab: 'cpuTab', paramMetric: 'cpuMetric' }}
          >
            <PodsChartPresenter
              metrics={[
                {
                  metric: 'cpu.total_usage',
                  label: t('in-kubernetes:dashboards.usage'),
                  color: usage,
                  ...defaultMetricConfig,
                  ...isContainerMetric
                },
                {
                  metric: 'cpuRequests',
                  label: t('in-kubernetes:dashboards.requests'),
                  color: requests,
                  ...defaultMetricConfig
                },
                {
                  metric: 'cpuLimits',
                  label: t('in-kubernetes:dashboards.limits'),
                  color: limits,
                  ...defaultMetricConfig
                }
              ]}
              title={t('in-kubernetes:dashboards.cpuResources')}
              colors={[usage, requests, limits]}
              formatter="number.detailed"
              tooltipFormatter={number.detailed}
            />
          </TimeShiftAwareChartSelectorWithUrlState>
        </Col>
        <Col lg={6}>
          <TimeShiftAwareChartSelectorWithUrlState
            cardTitle={t('in-kubernetes:labelMemoryResources')}
            tabs={[
              {
                id: 'memoryResources',
                label: t('in-kubernetes:labelMemoryResources')
              }
            ]}
            metrics={[
              {
                id: 'memoryUsage',
                label: t('in-kubernetes:dashboards.usage'),
                value: 'memory.total_usage',
                tab: memoryResourcesTabId,
                tabDefault: true
              },
              {
                id: 'memoryRequests',
                label: t('in-kubernetes:dashboards.requests'),
                value: 'memoryRequests',
                tab: memoryResourcesTabId
              },
              {
                id: 'memoryLimits',
                label: t('in-kubernetes:dashboards.memoryLimits'),
                value: 'memoryLimits',
                tab: memoryResourcesTabId
              }
            ]}
            urlMatrixParamConfig={{ path: summaryTab, paramTab: 'memoryTab', paramMetric: 'memoryMetric' }}
          >
            <PodsChartPresenter
              metrics={[
                {
                  metric: 'memory.usage',
                  label: t('in-kubernetes:dashboards.usage'),
                  color: usage,
                  ...defaultMetricConfig,
                  ...isContainerMetric
                },
                {
                  metric: 'memoryRequests',
                  label: t('in-kubernetes:dashboards.requests'),
                  color: requests,
                  ...defaultMetricConfig
                },
                {
                  metric: 'memoryLimits',
                  label: t('in-kubernetes:dashboards.limits'),
                  color: limits,
                  ...defaultMetricConfig
                }
              ]}
              title={t('in-kubernetes:dashboards.memoryResources')}
              colors={[usage, requests, limits]}
              formatter="bytes.detailed"
              tooltipFormatter={bytes.detailed}
            />
          </TimeShiftAwareChartSelectorWithUrlState>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <LogsChartInteractionWrapper
            tagFilterExpression={andQuery(clusterTag, nsTag, podTag)}
            timeConfig={timeConfig}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <Card title={t('in-kubernetes:dashboards.containerStatus')} useMaxAvailableHeight>
            <ContainerStates pod={pod} timeConfig={timeConfig} />
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <ConditionsTableCard
            conditions={pod.conditions}
            viewAllHref$={getPodDashboard(pod.id, { tab: '/conditions' })}
          />
        </Col>
      </Row>
    </Fragment>
  );
}
