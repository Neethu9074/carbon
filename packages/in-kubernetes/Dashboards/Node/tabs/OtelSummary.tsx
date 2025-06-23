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
import { andQuery, tagEquals } from 'in-kubernetes/Dashboards/commonComponents/LogsChartInteractionWrapper';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import MultiMetricBigNumberKpiCard from 'in-kubernetes/components/MultiMetricBigNumberKpiCard';
import { resourceQuotaBytes, resourceQuotaPercentage } from 'in-kubernetes/formatters';
import { blue } from 'in-custom-dashboards/widgets/BigNumber/comparisonColors';
import { k8sNodeChart } from 'in-kubernetes/components/K8sChartColors';
import { bytes, percentage } from 'in-services/formatters/number';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { summaryTab } from 'in-kubernetes/navigation/paths';
import { getChartGranularity } from 'in-stores/metric';
import { Col, Row } from 'in-components/layout/Grid';
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

  const nodeTagId = tagEquals('id.oTelK8sNode', snapshotId);
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

  return (
    <>
      <MissingK8sPermissions resourceSnapshotId={node.id} timeConfig={timeConfig} />
      <Row>
        <Col lg={kpiWidth}>
          <MultiMetricBigNumberKpiCard
            title={t('in-kubernetes:dashboards.cpuUtilization')}
            formatter={[resourceQuotaPercentage, percentage.detailed]}
            config={[
              {
                metricConfiguration: {
                  metric: 'k8s.node.cpu.utilization',
                  ...defaultBigNumberMetricConfig
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
        <Col lg={kpiWidth}>
          <MultiMetricBigNumberKpiCard
            title={t('in-kubernetes:dashboards.memoryUsage')}
            formatter={[resourceQuotaBytes, percentage.detailed]}
            config={[
              {
                metricConfiguration: {
                  metric: 'k8s.node.memory.usage',
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
            title={t('in-kubernetes:dashboards.memoryAvailable')}
            formatter={[resourceQuotaBytes, percentage.detailed]}
            config={[
              {
                metricConfiguration: {
                  metric: 'k8s.node.memory.available',
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
            title={t('in-kubernetes:dashboards.filesystemCapacity')}
            formatter={[resourceQuotaBytes, percentage.detailed]}
            config={[
              {
                metricConfiguration: {
                  metric: 'k8s.node.filesystem.capacity',
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
            title={t('in-kubernetes:dashboards.filesystemAvailable')}
            formatter={[resourceQuotaBytes, percentage.detailed]}
            config={[
              {
                metricConfiguration: {
                  metric: 'k8s.node.filesystem.available',
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
                metric: 'k8s.node.cpu.utilization',
                label: t('in-kubernetes:dashboards.cpuUtilization'),
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
            formatter="percentage.detailed"
            tooltipFormatter={percentage.detailed}
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
                metric: 'k8s.node.memory.usage',
                label: t('in-kubernetes:dashboards.memoryUsage'),
                color: usage,
                ...defaultChartMetricConfig,
                ...isContainerMetric
              },
              {
                metric: 'k8s.node.memory.available',
                label: t('in-kubernetes:dashboards.memoryAvailable'),
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
                metric: 'k8s.node.filesystem.available',
                label: t('in-kubernetes:dashboards.filesystemAvailable'),
                color: usage,
                ...defaultChartMetricConfig
              },
              {
                metric: 'k8s.node.filesystem.capacity',
                label: t('in-kubernetes:dashboards.filesystemCapacity'),
                color: capacity,
                ...defaultChartMetricConfig
              }
            ]}
            title={t('in-kubernetes:dashboards.filesystemResources')}
            colors={[usage, capacity]}
            formatter="bytes.detailed"
            tooltipFormatter={bytes.detailed}
            paramTab="allocTab"
            paramMetric="allocMetric"
            path={summaryTab}
            hasActionlane
            snapshotId={snapshotId}
            hasButtonInActionslane={false}
          />
        </Col>
      </Row>
    </>
  );
}
