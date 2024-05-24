/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { AggregationType, ResultType, TimeConfig } from '@instana/types';

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
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { resourceQuotaBytes, resourceQuotaNumber } from 'in-kubernetes/formatters';
import { useGetK8sEntityUid } from 'in-kubernetes/Dashboards/useGetK8sEntityUid';
import { blue } from 'in-custom-dashboards/widgets/BigNumber/comparisonColors';
import { k8sChartColors } from 'in-kubernetes/components/K8sChartColors';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { getChartGranularity } from 'in-stores/metric/metric';
import { summaryTab } from 'in-kubernetes/navigation/paths';
import { Col, Row } from 'in-components/layout/Grid';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

interface SummaryProps {
  timeConfig: TimeConfig;
  data: any;
}

export default function Summary({ timeConfig, data: daemonSet }: SummaryProps) {
  const timeShift = useTimeShiftConfig();
  const snapshotId = daemonSet.id;

  const { tagFilterExpression: logsChartQuery } = useGetK8sEntityUid('kubernetes.daemonSet', snapshotId, timeConfig);

  const { usage, limits, requests, pending, allocated, unscheduled, unready } = k8sChartColors;

  const daemonSetTagId = tagEquals('id.kubernetesDaemonSet', snapshotId);
  const daemonSetQuery = andQuery(daemonSetTagId);
  const tagFilterExpression = toBackendQueryModel(daemonSetQuery);

  const tagFilterExpressionPodPhase = (phase: string) =>
    toBackendQueryModel(andQuery(daemonSetTagId, tagEquals('kubernetes.pod.phase', phase)));
  const type = plugins.kubernetesDaemonSet;

  const defaultConfig = {
    source,
    type,
    aggregation: 'MEAN' as AggregationType,
    tagFilterExpression,
    timeConfig,
    timeShift
  };

  const isPodSumMetric = {
    type: plugins.kubernetesPod,
    crossSeriesAggregation: 'SUM' as AggregationType
  };
  const isPodCountMetric = {
    type: plugins.kubernetesPod,
    crossSeriesAggregation: 'DISTINCT_COUNT' as AggregationType
  };

  const runningPodBigNumberMetricConfig = {
    ...defaultConfig,
    ...isPodSumMetric,
    resultType: 'SINGLE_NUMBER' as ResultType
  };

  const runningPodCountBigNumberMetricConfig = {
    ...defaultConfig,
    ...isPodCountMetric,
    tagFilterExpression: tagFilterExpressionPodPhase('Running'),
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

  const comparisonColors = {
    comparisonDecreaseColor: blue.id,
    comparisonIncreaseColor: blue.id
  };

  return (
    <>
      <MissingK8sPermissions resourceSnapshotId={daemonSet.id} timeConfig={timeConfig} />
      <Row>
        <Col lg={2}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.cpuRequests')}
            formatter={resourceQuotaNumber}
            config={{
              metricConfiguration: {
                metric: 'cpuRequests',
                ...runningPodBigNumberMetricConfig
              },
              ...comparisonColors
            }}
            raw
          />
        </Col>
        <Col lg={2}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.cpuLimits')}
            formatter={resourceQuotaNumber}
            config={{
              metricConfiguration: {
                metric: 'cpuLimits',
                ...runningPodBigNumberMetricConfig
              },
              ...comparisonColors
            }}
            raw
          />
        </Col>
        <Col lg={2}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.memoryRequests')}
            formatter={resourceQuotaBytes}
            config={{
              metricConfiguration: {
                metric: 'memoryRequests',
                ...runningPodBigNumberMetricConfig
              },
              ...comparisonColors
            }}
            raw
          />
        </Col>
        <Col lg={2}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.memoryLimits')}
            formatter={resourceQuotaBytes}
            config={{
              metricConfiguration: {
                metric: 'memoryLimits',
                ...runningPodBigNumberMetricConfig
              },
              ...comparisonColors
            }}
            raw
          />
        </Col>
        <Col lg={4}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.podsAlloc')}
            formatter={zeroDecimalPlaces}
            config={{
              metricConfiguration: {
                metric: 'pods.count',
                ...runningPodCountBigNumberMetricConfig
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
                metric: 'cpuRequests',
                label: t('in-kubernetes:dashboards.requests'),
                color: requests,
                ...defaultChartMetricConfig,
                ...isPodSumMetric
              },
              {
                metric: 'cpuLimits',
                label: t('in-kubernetes:dashboards.limits'),
                color: limits,
                ...defaultChartMetricConfig,
                ...isPodSumMetric
              }
            ]}
            title={t('in-kubernetes:dashboards.cpuResources')}
            colors={[usage, requests, limits]}
            formatter="numbers.detailed"
            tooltipFormatter={resourceQuotaNumber}
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
                metric: 'memoryRequests',
                label: t('in-kubernetes:dashboards.requests'),
                color: requests,
                ...defaultChartMetricConfig,
                ...isPodSumMetric
              },
              {
                metric: 'memoryLimits',
                label: t('in-kubernetes:dashboards.limits'),
                color: limits,
                ...defaultChartMetricConfig,
                ...isPodSumMetric
              }
            ]}
            title={t('in-kubernetes:dashboards.memoryResources')}
            colors={[usage, requests, limits]}
            formatter="bytes.detailed"
            tooltipFormatter={resourceQuotaBytes}
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
                metric: 'pods.count',
                label: t('in-kubernetes:dashboards.allocated'),
                color: allocated,
                ...defaultChartMetricConfig,
                tagFilterExpression: tagFilterExpressionPodPhase('Running'),
                ...isPodCountMetric
              },
              {
                metric: 'phase.Pending.count',
                label: t('in-kubernetes:dashboards.pending'),
                color: pending,
                ...defaultChartMetricConfig,
                tagFilterExpression: tagFilterExpressionPodPhase('Pending'),
                ...isPodCountMetric
              },
              {
                metric: 'conditions.PodScheduled.False',
                label: t('in-kubernetes:dashboards.unscheduled'),
                color: unscheduled,
                ...defaultChartMetricConfig
              },
              {
                metric: 'conditions.Ready.False',
                label: t('in-kubernetes:dashboards.unready'),
                color: unready,
                ...defaultChartMetricConfig
              }
            ]}
            title={t('in-kubernetes:dashboards.pods')}
            colors={[allocated, pending, unscheduled, unready]}
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
      <Row>
        <Col lg={12}>
          <KubernetesTimeShiftChartPresenter
            metrics={[
              {
                metric: 'availableReplicas',
                label: t('in-kubernetes:dashboards.available'),
                color: usage,
                ...defaultChartMetricConfig
              },
              {
                metric: 'desiredReplicas',
                label: t('in-kubernetes:dashboards.desired'),
                color: requests,
                ...defaultChartMetricConfig,
                ...isContainerMetric
              },
              {
                metric: 'unavailableReplicas',
                label: t('in-kubernetes:dashboards.unavailable'),
                color: limits,
                ...defaultChartMetricConfig
              },
              {
                metric: 'misscheduledReplicas',
                label: t('in-kubernetes:dashboards.misscheduled'),
                color: limits,
                ...defaultChartMetricConfig
              }
            ]}
            title={t('in-kubernetes:dashboards.replicas')}
            colors={[allocated, pending, unscheduled, unready]}
            formatter="number.compact"
            tooltipFormatter={zeroDecimalPlaces}
            paramTab="replicaTab"
            paramMetric="replicaMetric"
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
