/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { Fragment } from 'react';

import { AggregationType, KubernetesWorkloadController, ResultType, TimeConfig } from '@instana/types';

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
// @ts-expect-error
import ConditionsTableCard from 'in-kubernetes/Dashboards/commonComponents/ConditionsTableCard';
import { zeroDecimalPlaces, timeByMillisTwoDecimalPlaces, number } from 'in-services/formatters/number';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
// @ts-expect-error
import { getDeploymentDashboard } from 'in-kubernetes/navigation/paths';
import { resourceQuotaNumber, resourceQuotaBytes } from 'in-kubernetes/formatters';
// @ts-expect-error
import { summaryTab } from 'in-kubernetes/navigation/paths';
import { blue } from 'in-custom-dashboards/widgets/BigNumber/comparisonColors';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
// @ts-expect-error
import { plugins } from 'in-forge/constants';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { getChartGranularity } from 'in-stores/metric';
import { Row, Col } from 'in-components/layout/Grid';
import theme from 'in-themes';
import { t } from 'in-i18n';

const noActivity = t('in-kubernetes:dashboards.noActivity');
const msFormatter = (d: number) => (d < 0 ? noActivity : timeByMillisTwoDecimalPlaces(d));

interface SummaryProps {
  data: KubernetesWorkloadController;
  timeConfig: TimeConfig;
}

export default function Summary({ timeConfig, data: deployment }: SummaryProps) {
  const timeShift = useTimeShiftConfig();

  const snapshotId = deployment.id;
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

  const comparisonColors = {
    comparisonDecreaseColor: blue.id,
    comparisonIncreaseColor: blue.id
  };

  const clusterTag = kubernetesClusterTagEquals(deployment.clusterId);
  const nsTag = kubernetesNamespaceTagEquals(deployment.namespace);
  const workloadTag = tagEquals('kubernetes.deployment.name', deployment.name);
  const tagFilterExpression = toBackendQueryModel(andQuery(clusterTag, nsTag, workloadTag));
  const type = plugins.kubernetesDeployment;
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

  return (
    <Fragment>
      <MissingK8sPermissions resourceSnapshotId={deployment.id} timeConfig={timeConfig} />

      <Row>
        <Col lg={2}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.cpuRequests')}
            formatter={resourceQuotaNumber}
            config={{
              metricConfiguration: {
                metric: 'pods.required_cpu',
                ...defaultBigNumberMetricConfig
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
                metric: 'pods.limit_cpu',
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
            formatter={resourceQuotaBytes}
            config={{
              metricConfiguration: {
                metric: 'pods.required_mem',
                ...defaultBigNumberMetricConfig
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
                metric: 'pods.limit_mem',
                ...defaultBigNumberMetricConfig
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
                ...defaultMetricConfig,
                ...isContainerMetric
              },
              {
                metric: 'pods.required_cpu',
                label: t('in-kubernetes:dashboards.requests'),
                color: requests,
                ...defaultMetricConfig
              },
              {
                metric: 'pods.limit_cpu',
                label: t('in-kubernetes:dashboards.limits'),
                color: limits,
                ...defaultMetricConfig
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
                ...defaultMetricConfig,
                ...isContainerMetric
              },
              {
                metric: 'pods.required_mem',
                label: t('in-kubernetes:dashboards.requests'),
                color: requests,
                ...defaultMetricConfig
              },
              {
                metric: 'pods.limit_mem',
                label: t('in-kubernetes:dashboards.limits'),
                color: limits,
                ...defaultMetricConfig
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
                ...defaultMetricConfig
              },
              {
                metric: 'phase.Pending.count',
                label: t('in-kubernetes:dashboards.pending'),
                color: pending,
                ...defaultMetricConfig
              },
              {
                metric: 'conditions.PodScheduled.False',
                label: t('in-kubernetes:dashboards.unscheduled'),
                color: unscheduled,
                ...defaultMetricConfig
              },
              {
                metric: 'conditions.Ready.False',
                label: t('in-kubernetes:dashboards.unready'),
                color: unready,
                ...defaultMetricConfig
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
        <Col lg={6}>
          <KubernetesTimeShiftChartPresenter
            metrics={[
              {
                metric: 'availableReplicas',
                label: t('in-kubernetes:dashboards.available'),
                ...defaultMetricConfig
              },
              {
                metric: 'desiredReplicas',
                label: t('in-kubernetes:dashboards.desired'),
                ...defaultMetricConfig,
                color: desired
              }
            ]}
            title={t('in-kubernetes:dashboards.replicas')}
            colors={[allocated, desired]}
            formatter="number.compact"
            tooltipFormatter={number.compact}
            paramTab="replicasTab"
            paramMetric="replicasMetric"
            path={summaryTab}
          />
        </Col>
        <Col lg={6}>
          <KubernetesTimeShiftChartPresenter
            metrics={[
              {
                metric: 'duration',
                label: t('in-kubernetes:dashboards.pendingPhaseDuration'),
                color: allocated,
                ...defaultMetricConfig
              }
            ]}
            title={t('in-kubernetes:dashboards.pendingPhaseDuration')}
            colors={[allocated]}
            formatter="millis.detailed"
            tooltipFormatter={msFormatter}
            paramTab="pendingTab"
            paramMetric="pendingMetric"
            path={summaryTab}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <ConditionsTableCard
            conditions={deployment.conditions}
            viewAllHref$={getDeploymentDashboard(snapshotId, { tab: '/conditions' })}
          />
        </Col>
      </Row>
    </Fragment>
  );
}
