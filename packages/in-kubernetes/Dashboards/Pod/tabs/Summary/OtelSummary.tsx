/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { AggregationType, KubernetesPod, ResultType, TimeConfig } from '@instana/types';

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
// @ts-expect-error
import ContainerStates from 'in-kubernetes/Dashboards/Pod/tabs/Summary/ContainerStates';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { bytes, percentage, timeBySecondsTwoDecimalPlaces } from 'in-services/formatters/number';
import { k8sPodAndServiceChart, k8sNodeChart } from 'in-kubernetes/components/K8sChartColors';
import { resourceQuotaBytes, resourceQuotaPercentage } from 'in-kubernetes/formatters';
import { blue } from 'in-custom-dashboards/widgets/BigNumber/comparisonColors';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { summaryTab } from 'in-kubernetes/navigation/paths';
import { getChartGranularity } from 'in-stores/metric';
import { Col, Row } from 'in-components/layout/Grid';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

interface SummaryProps {
  data: KubernetesPod;
  timeConfig: TimeConfig;
}

export default function OtelSummary({ data: pod, timeConfig }: SummaryProps) {
  const timeShift = useTimeShiftConfig();
  const snapshotId = pod.id;

  const kpiWidth = 2;

  const podTagId = tagEquals('id.oTelK8sPod', snapshotId);
  const podQuery = andQuery(podTagId);
  const tagFilterExpression = toBackendQueryModel(podQuery);

  const type = plugins.oTelK8sPod;

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

  const { limits, requests, usage } = k8sPodAndServiceChart;
  const { capacity } = k8sNodeChart;

  const comparisonColors = {
    comparisonDecreaseColor: blue.id,
    comparisonIncreaseColor: blue.id
  };

  return (
    <>
      <MissingK8sPermissions resourceSnapshotId={pod.id} timeConfig={timeConfig} />
      <Row>
        <Col lg={kpiWidth}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.cpuUtilization')}
            formatter={resourceQuotaPercentage}
            config={{
              metricConfiguration: {
                metric: 'k8s.pod.cpu.utilization',
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
            title={t('in-kubernetes:dashboards.cpuTime')}
            formatter={timeBySecondsTwoDecimalPlaces}
            config={{
              metricConfiguration: {
                metric: 'k8s.pod.cpu.time',
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
            formatter={resourceQuotaBytes}
            config={{
              metricConfiguration: {
                metric: 'k8s.pod.memory.usage',
                ...defaultBigNumberMetricConfig
              },
              ...comparisonColors
            }}
            raw
          />
        </Col>
        <Col lg={kpiWidth}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.memoryAvailable')}
            formatter={resourceQuotaBytes}
            config={{
              metricConfiguration: {
                metric: 'k8s.pod.memory.available',
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
            title={t('in-kubernetes:dashboards.filesystemCapacity')}
            formatter={resourceQuotaBytes}
            config={{
              metricConfiguration: {
                metric: 'k8s.pod.filesystem.capacity',
                ...defaultBigNumberMetricConfig
              },
              ...comparisonColors
            }}
            raw
          />
        </Col>
        <Col lg={kpiWidth}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.filesystemAvailable')}
            formatter={resourceQuotaBytes}
            config={{
              metricConfiguration: {
                metric: 'k8s.pod.filesystem.available',
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
          <KubernetesTimeShiftChartPresenter
            metrics={[
              {
                metric: 'k8s.pod.cpu.utilization',
                label: t('in-kubernetes:dashboards.cpuUtilization'),
                color: usage,
                ...defaultChartMetricConfig,
                ...isContainerMetric
              },
              {
                metric: 'cpuRequests',
                label: t('in-kubernetes:dashboards.requests'),
                color: requests,
                ...defaultChartMetricConfig
              },
              {
                metric: 'cpuLimits',
                label: t('in-kubernetes:dashboards.limits'),
                color: limits,
                ...defaultChartMetricConfig
              }
            ]}
            title={t('in-kubernetes:dashboards.cpuResources')}
            colors={[usage, requests, limits]}
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
        <Col lg={6}>
          <KubernetesTimeShiftChartPresenter
            metrics={[
              {
                metric: 'k8s.pod.memory.usage',
                label: t('in-kubernetes:dashboards.memoryUsage'),
                color: usage,
                ...defaultChartMetricConfig,
                ...isContainerMetric
              },
              {
                metric: 'k8s.pod.memory.available',
                label: t('in-kubernetes:dashboards.memoryAvailable'),
                color: requests,
                ...defaultChartMetricConfig
              },
              {
                metric: 'k8s.pod.memory.rss',
                label: t('in-kubernetes:dashboards.memoryRss'),
                color: limits,
                ...defaultChartMetricConfig
              },
              {
                metric: 'k8s.pod.memory.working_sets',
                label: t('in-kubernetes:dashboards.memoryWorkingset'),
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
      </Row>
    </>
  );
}
