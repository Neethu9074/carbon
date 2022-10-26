/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { AggregationType, ResultType } from '@instana/types';

import {
  LogsChartInteractionWrapper,
  andQuery,
  kubernetesClusterTagEquals,
  kubernetesNamespaceTagEquals,
  tagEquals
} from 'in-kubernetes/Dashboards/commonComponents/LogsChartInteractionWrapper';
// @ts-expect-error
import { source } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/metrics';
import KubernetesTimeShiftChartPresenter from 'in-kubernetes/Dashboards/commonComponents/KubernetesTimeShiftChartPresenter';
// @ts-expect-error
import MissingK8sPermissions from 'in-kubernetes/Dashboards/commonComponents/MissingK8sPermissions';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { resourceQuotaNumber, resourceQuotaBytes } from 'in-kubernetes/formatters';
// @ts-expect-error
import { summaryTab } from 'in-kubernetes/navigation/paths';
import { blue } from 'in-custom-dashboards/widgets/BigNumber/comparisonColors';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
// @ts-expect-error
import { plugins } from 'in-forge/constants';
import { getChartGranularity } from 'in-stores/metric/metric';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { Row, Col } from 'in-components/layout/Grid';
import theme from 'in-themes';
import { t } from 'in-i18n';

export default function Summary({ timeConfig, data: statefulSet }: any) {
  const timeShift = useTimeShiftConfig();

  const {
    orange800: limits,
    lime800: requests,
    lightBlue800: usage,
    orange800: pending,
    lightBlue800: allocated,
    deepPurple800: unscheduled,
    pink800: unready,
    success: desired
  } = theme.lib.colors;

  const clusterTag = kubernetesClusterTagEquals(statefulSet.clusterId);
  const nsTag = kubernetesNamespaceTagEquals(statefulSet.namespace);
  const workloadTag = tagEquals('kubernetes.statefulset.name', statefulSet.name);
  const runningPod = tagEquals('kubernetes.pod.phase', 'Running');
  const tagFilterExpressionRunningPod = toBackendQueryModel(andQuery(clusterTag, nsTag, runningPod));
  // const tagFilterExpression = toBackendQueryModel(andQuery(clusterTag, nsTag, workloadTag));

  const type = plugins.kubernetesStatefulSet;

  const defaultConfig = {
    source,
    type,
    aggregation: 'MEAN' as AggregationType,
    tagFilterExpression: tagFilterExpressionRunningPod,
    timeConfig,
    timeShift
  };

  const isPodMetric = {
    type: plugins.kubernetesPod,
    crossSeriesAggregation: 'SUM' as AggregationType
  };
  const isPodCountMetric = {
    type: plugins.kubernetesPod,
    crossSeriesAggregation: 'DISTINCT_COUNT' as AggregationType
  };
  // const defaultBigNumberMetricConfig = {
  //   ...defaultConfig,
  //   resultType: 'SINGLE_NUMBER' as ResultType
  // };

  const runningPodBigNumberMetricConfig = {
    ...defaultConfig,
    ...isPodMetric,
    tagFilterExpression: tagFilterExpressionRunningPod,
    resultType: 'SINGLE_NUMBER' as ResultType
  };

  const runningPodCountBigNumberMetricConfig = {
    ...defaultConfig,
    ...isPodCountMetric,
    tagFilterExpression: tagFilterExpressionRunningPod,
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
    <Fragment>
      <MissingK8sPermissions resourceSnapshotId={statefulSet.id} timeConfig={timeConfig} />

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
                ...isPodMetric
              },
              {
                metric: 'cpuLimits',
                label: t('in-kubernetes:dashboards.limits'),
                color: limits,
                ...defaultChartMetricConfig,
                ...isPodMetric
              }
            ]}
            title={t('in-kubernetes:dashboards.cpuResources')}
            colors={[usage, requests, limits]}
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
                ...isPodMetric
              },
              {
                metric: 'memoryLimits',
                label: t('in-kubernetes:dashboards.limits'),
                color: limits,
                ...defaultChartMetricConfig,
                ...isPodMetric
              }
            ]}
            title={t('in-kubernetes:dashboards.memoryResources')}
            colors={[usage, requests, limits]}
            formatter="bytes.detailed"
            tooltipFormatter={resourceQuotaBytes}
            paramTab="memTab"
            paramMetric="memMetric"
            path={summaryTab}
          />
        </Col>
        <Col lg={4}>
          <KubernetesTimeShiftChartPresenter
            metrics={[
              {
                metric: 'pods.count',
                label: t('in-kubernetes:dashboards.allocated'),
                color: allocated,
                ...defaultChartMetricConfig
              },
              {
                metric: 'phase.Pending.count',
                label: t('in-kubernetes:dashboards.pending'),
                color: pending,
                ...defaultChartMetricConfig
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
          />
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <LogsChartInteractionWrapper
            tagFilterExpression={andQuery(clusterTag, nsTag, workloadTag)}
            timeConfig={timeConfig}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <KubernetesTimeShiftChartPresenter
            metrics={[
              {
                metric: 'availableReplicas',
                label: t('in-kubernetes:dashboards.available'),
                color: allocated,
                ...defaultChartMetricConfig
              },
              {
                metric: 'desiredReplicas',
                label: t('in-kubernetes:dashboards.desired'),
                color: desired,
                ...defaultChartMetricConfig
              },
              {
                metric: 'unavailableReplicas',
                label: t('in-kubernetes:dashboards.unavailable'),
                color: pending,
                ...defaultChartMetricConfig
              },
              {
                metric: 'misscheduledReplicas',
                label: t('in-kubernetes:dashboards.misscheduled'),
                color: unscheduled,
                ...defaultChartMetricConfig
              }
            ]}
            title={t('in-kubernetes:dashboards.replicas')}
            colors={[allocated, desired, pending, unscheduled]}
            formatter="number.compact"
            tooltipFormatter={zeroDecimalPlaces}
            paramTab="replicaTab"
            paramMetric="replicaMetric"
            path={summaryTab}
          />
          {/* <Card title={t('in-kubernetes:dashboards.replicas')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: zeroDecimalPlaces,
                metrics: ['availableReplicas', 'desiredReplicas', 'unavailableReplicas', 'misscheduledReplicas'],
                labels: [
                  t('in-kubernetes:dashboards.available'),
                  t('in-kubernetes:dashboards.desired'),
                  t('in-kubernetes:dashboards.unavailable'),
                  t('in-kubernetes:dashboards.misscheduled')
                ],
                type: 'line'
              }}
              renderPostChartContent={K8DashboardsMarkerLanes}
            />
          </Card> */}
        </Col>
      </Row>
    </Fragment>
  );
}
