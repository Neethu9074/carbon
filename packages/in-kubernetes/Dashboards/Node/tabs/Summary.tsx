/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { AggregationType, KubernetesNode, ResultType, TimeConfig } from '@instana/types';

// @ts-expect-error
import { source } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/metrics';
import KubernetesTimeShiftChartPresenter from 'in-kubernetes/Dashboards/commonComponents/KubernetesTimeShiftChartPresenter';
// @ts-expect-error
import MissingK8sPermissions from 'in-kubernetes/Dashboards/commonComponents/MissingK8sPermissions';
import { LogsChartInteractionWrapper } from 'in-kubernetes/Dashboards/commonComponents/LogsChartInteractionWrapper';
// @ts-expect-error
import ConditionsTableCard from 'in-kubernetes/Dashboards/commonComponents/ConditionsTableCard';
import { kubernetesClusterTagEquals } from 'in-kubernetes/Dashboards/commonComponents/LogsChartInteractionWrapper';
import { tagEquals, andQuery } from 'in-kubernetes/Dashboards/commonComponents/LogsChartInteractionWrapper';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
// @ts-expect-error
import { getNodeDashboard, summaryTab } from 'in-kubernetes/navigation/paths';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { blue } from 'in-custom-dashboards/widgets/BigNumber/comparisonColors';
import { percentage, number, bytes } from 'in-services/formatters/number';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
// @ts-expect-error
import { plugins } from 'in-forge/constants';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { formatDuration } from 'in-services/formatters/date';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { getChartGranularity } from 'in-stores/metric';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import Capitalize from 'in-components/Capitalize';
import theme from 'in-themes';
import { t } from 'in-i18n';

interface SummaryProps {
  data: KubernetesNode;
  timeConfig: TimeConfig;
}

export default function Summary({ timeConfig, data: node }: SummaryProps) {
  const timeShift = useTimeShiftConfig();
  const snapshotId = node.id;

  const { teal800: capacity, orange800: limits, lime800: requests, lightBlue800: usage } = theme.lib.colors;
  const clusterTag = kubernetesClusterTagEquals(node.clusterId);
  const workloadTag = tagEquals('kubernetes.node.name', node.name);
  const query = andQuery(clusterTag, workloadTag);
  const tagFilterExpression = toBackendQueryModel(query);
  const type = plugins.kubernetesNode;

  const kpiWidth = 2;

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

  const comparisonColors = {
    comparisonDecreaseColor: blue.id,
    comparisonIncreaseColor: blue.id
  };
  const isContainerMetric = {
    /* use this configuration on containers of this pod (which can be of type docker, containerd or crio)
      type filtering must be disabled and cross series aggregation uses SUM */
    type: undefined,
    crossSeriesAggregation: 'SUM' as AggregationType
  };

  return (
    <Fragment>
      <MissingK8sPermissions resourceSnapshotId={node.id} timeConfig={timeConfig} />

      <KpiGridRow sizes={[4, 4, 4]}>
        <KpiCard
          title={t('in-kubernetes:dashboards.status')}
          value={<Capitalize>{node.status || valueMissingPlaceholder}</Capitalize>}
          raw
          borderless
        />
        <KpiCard
          title={t('in-kubernetes:dashboards.roles')}
          value={<Capitalize>{node.roles || valueMissingPlaceholder}</Capitalize>}
          raw
          borderless
        />
        <KpiCard
          title={t('in-kubernetes:dashboards.age')}
          value={node.age ? formatDuration(node.age) : valueMissingPlaceholder}
          raw
          borderless
        />
      </KpiGridRow>
      <Row>
        <Col lg={kpiWidth}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.cpuRequests')}
            formatter={percentage.detailed}
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
        <Col lg={kpiWidth}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.cpuLimits')}
            formatter={percentage.detailed}
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
        <Col lg={kpiWidth}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.memoryRequests')}
            formatter={percentage.detailed}
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
        <Col lg={kpiWidth}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.memoryLimits')}
            formatter={percentage.detailed}
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
        <Col lg={kpiWidth}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.podsAlloc')}
            formatter={percentage.detailed}
            config={{
              metricConfiguration: {
                metric: 'alloc_pods_percentage',
                ...defaultBigNumberMetricConfig
              },
              ...comparisonColors
            }}
            raw
          />
        </Col>
      </Row>

      <Row>
        <Col lg={4}>
          <KubernetesTimeShiftChartPresenter
            metrics={[
              {
                metric: 'cpu.total_usage',
                label: t('in-kubernetes:dashboards.usage'),
                color: usage,
                ...defaultChartMetricConfig,
                ...isContainerMetric
              },
              {
                metric: 'required_cpu',
                label: t('in-kubernetes:dashboards.requests'),
                color: requests,
                ...defaultChartMetricConfig
              },
              {
                metric: 'limit_cpu',
                label: t('in-kubernetes:dashboards.limits'),
                color: limits,
                ...defaultChartMetricConfig
              },
              {
                metric: 'cap_cpu',
                label: t('in-kubernetes:dashboards.capacity'),
                color: capacity,
                ...defaultChartMetricConfig
              }
            ]}
            title={t('in-kubernetes:dashboards.cpuResources')}
            colors={[usage, requests, limits, capacity]}
            formatter="number.detailed"
            tooltipFormatter={number.detailed}
            paramTab="cpuTab"
            paramMetric="cpuMetric"
            path={summaryTab}
          />
        </Col>
        <Col lg={4}>
          <KubernetesTimeShiftChartPresenter
            metrics={[
              {
                metric: 'memory.usage',
                label: t('in-kubernetes:dashboards.usage'),
                color: usage,
                ...defaultChartMetricConfig,
                ...isContainerMetric
              },
              {
                metric: 'required_mem',
                label: t('in-kubernetes:dashboards.requests'),
                color: requests,
                ...defaultChartMetricConfig
              },
              {
                metric: 'limit_mem',
                label: t('in-kubernetes:dashboards.limits'),
                color: limits,
                ...defaultChartMetricConfig
              },
              {
                metric: 'cap_mem',
                label: t('in-kubernetes:dashboards.capacity'),
                color: capacity,
                ...defaultChartMetricConfig
              }
            ]}
            title={t('in-kubernetes:dashboards.memoryResources')}
            colors={[usage, requests, limits, capacity]}
            formatter="bytes.detailed"
            tooltipFormatter={bytes.detailed}
            paramTab="memoryTab"
            paramMetric="memoryMetric"
            path={summaryTab}
          />
        </Col>
        <Col lg={4}>
          <KubernetesTimeShiftChartPresenter
            metrics={[
              {
                metric: 'allocatedPods',
                label: t('in-kubernetes:dashboards.allocated'),
                color: usage,
                ...defaultChartMetricConfig
              },
              {
                metric: 'cap_pods',
                label: t('in-kubernetes:dashboards.capacity'),
                color: capacity,
                ...defaultChartMetricConfig
              }
            ]}
            title={t('in-kubernetes:dashboards.podsAllocation')}
            colors={[usage, capacity]}
            formatter="number.compact"
            tooltipFormatter={number.compact}
            paramTab="allocTab"
            paramMetric="allocMetric"
            path={summaryTab}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <LogsChartInteractionWrapper tagFilterExpression={query} timeConfig={timeConfig} />
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <ConditionsTableCard
            conditions={node.conditions}
            viewAllHref$={getNodeDashboard(snapshotId, { tab: '/conditions' })}
          />
        </Col>
      </Row>
    </Fragment>
  );
}
