/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { AggregationType, KubernetesNode, ResultType, TimeConfig } from '@instana/types';

// @ts-expect-error
import { source } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/metrics';
import KubernetesTimeShiftChartPresenter from 'in-kubernetes/Dashboards/commonComponents/KubernetesTimeShiftChartPresenter';
// @ts-expect-error
import MissingK8sPermissions from 'in-kubernetes/Dashboards/commonComponents/MissingK8sPermissions';
// @ts-expect-error
import ConditionsTableCard from 'in-kubernetes/Dashboards/commonComponents/ConditionsTableCard';
import {
  andQuery,
  tagEquals
} from 'in-kubernetes/Dashboards/commonComponents/LogsChartInteractionWrapper';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import MultiMetricBigNumberKpiCard from 'in-kubernetes/components/MultiMetricBigNumberKpiCard';
import { bytes, number, percentage, zeroDecimalPlaces } from 'in-services/formatters/number';
import { resourceQuotaBytes, resourceQuotaNumber } from 'in-kubernetes/formatters';
import { summaryTab, useOtelNodeDashboard } from 'in-kubernetes/navigation/paths';
import { blue } from 'in-custom-dashboards/widgets/BigNumber/comparisonColors';
import { k8sNodeChart } from 'in-kubernetes/components/K8sChartColors';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { formatDuration } from 'in-services/formatters/date';
import { capitalizeValue } from 'in-components/Capitalize';
import { getChartGranularity } from 'in-stores/metric';
import { Col, Row } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

interface SummaryProps {
  data: KubernetesNode;
  timeConfig: TimeConfig;
}

export default function OtelSummary({ timeConfig, data: node }: SummaryProps) {
  const timeShift = useTimeShiftConfig();
  const snapshotId = node.id;

  const { capacity, limits, requests, usage } = k8sNodeChart;

  const nodeTagId = tagEquals('id.otelK8sNode', snapshotId);
  const nodeQuery = andQuery(nodeTagId);
  const tagFilterExpression = toBackendQueryModel(nodeQuery);
  const type = plugins.oTelK8sNode;

  const kpiWidth = 2;

  const defaultConfig = {
    source,
    type,
    aggregation: 'MEAN' as AggregationType,
    tagFilterExpression,
    timeConfig,
    timeShift,
    regex: false
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

  const viewAllHref = useOtelNodeDashboard(snapshotId, { tab: '/conditions' });

  return (
    <>
      <MissingK8sPermissions resourceSnapshotId={node.id} timeConfig={timeConfig} />
      <KpiGridRow sizes={[4, 4, 4]}>
        <KpiCard
          title={t('in-kubernetes:dashboards.status')}
          value={node.status}
          renderValue={capitalizeValue}
          raw
          borderless
        />
        <KpiCard
          title={t('in-kubernetes:dashboards.roles')}
          value={node.roles}
          renderValue={capitalizeValue}
          raw
          borderless
        />
        <KpiCard
          title={t('in-kubernetes:dashboards.age')}
          value={node.age}
          renderValue={nodeAge => capitalizeValue(formatDuration(nodeAge))}
          raw
          borderless
        />
      </KpiGridRow>
      {/* required_cpu_percentage add in percentage metric instead of capacity */}
      <Row>
        <Col lg={kpiWidth}>
          <MultiMetricBigNumberKpiCard
            title={t('in-kubernetes:dashboards.cpuRequestsMultiMetric')}
            formatter={[resourceQuotaNumber, percentage.detailed]}
            config={[
              {
                metricConfiguration: {

                  metric: 'k8s.node.cpu.utilization',
                  //metric: 'required_cpu'
                  ...defaultBigNumberMetricConfig
                },
                ...comparisonColors
              },
              {
                metricConfiguration: {
                  metric: 'k8s.node.memory.usage',
                  //metric: 'required_cpu_percentage',
                  ...defaultBigNumberMetricConfig
                },
                ...comparisonColors
              }
            ]}
            raw
          />
        </Col>
        <Col lg={kpiWidth}>
          <MultiMetricBigNumberKpiCard
            title={t('in-kubernetes:dashboards.cpuLimitsMultiMetric')}
            formatter={[resourceQuotaNumber, percentage.detailed]}
            config={[
              {
                metricConfiguration: {
                  metric: 'k8s.node.memory.available',
                  //metric: 'limit_cpu',
                  ...defaultBigNumberMetricConfig
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
        <Col lg={kpiWidth}>
          <MultiMetricBigNumberKpiCard
            title={t('in-kubernetes:dashboards.memoryRequestsMultiMetric')}
            formatter={[resourceQuotaBytes, percentage.detailed]}
            config={[
              {
                metricConfiguration: {
                  metric: 'required_mem',
                  ...defaultBigNumberMetricConfig
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
        <Col lg={kpiWidth}>
          <MultiMetricBigNumberKpiCard
            title={t('in-kubernetes:dashboards.memoryLimitsMultiMetric')}
            formatter={[resourceQuotaBytes, percentage.detailed]}
            config={[
              {
                metricConfiguration: {
                  metric: 'limit_mem',
                  ...defaultBigNumberMetricConfig
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
        <Col lg={kpiWidth}>
          <MultiMetricBigNumberKpiCard
            title={t('in-kubernetes:dashboards.podsAlloc')}
            formatter={[zeroDecimalPlaces, percentage.detailed]}
            config={[
              {
                metricConfiguration: {
                  metric: 'allocatedPods',
                  ...defaultBigNumberMetricConfig
                },
                ...comparisonColors
              },
              {
                metricConfiguration: {
                  metric: 'alloc_pods_percentage',
                  ...defaultBigNumberMetricConfig
                },
                ...comparisonColors
              }
            ]}
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
            hasActionlane
            snapshotId={snapshotId}
            hasButtonInActionslane={false}
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
            hasActionlane
            snapshotId={snapshotId}
            hasButtonInActionslane={false}
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
            hasActionlane
            snapshotId={snapshotId}
            hasButtonInActionslane={false}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <ConditionsTableCard conditions={node.conditions} viewAllHref={viewAllHref} />
        </Col>
      </Row>
    </>
  );
}
