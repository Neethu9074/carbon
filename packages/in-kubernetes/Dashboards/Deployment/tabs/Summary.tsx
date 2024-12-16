/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { AggregationType, KubernetesWorkloadController, ResultType, TimeConfig } from '@instana/types';

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
// @ts-expect-error
import ConditionsTableCard from 'in-kubernetes/Dashboards/commonComponents/ConditionsTableCard';
import { number, timeByMillisTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { summaryTab, useDeploymentDashboard } from 'in-kubernetes/navigation/paths';
import { resourceQuotaBytes, resourceQuotaNumber } from 'in-kubernetes/formatters';
import { useGetK8sEntityUid } from 'in-kubernetes/Dashboards/useGetK8sEntityUid';
import { blue } from 'in-custom-dashboards/widgets/BigNumber/comparisonColors';
import { k8sChartColors } from 'in-kubernetes/components/K8sChartColors';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { getChartGranularity } from 'in-stores/metric';
import { Col, Row } from 'in-components/layout/Grid';
import { plugins } from 'in-forge/constants';
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

  const { tagFilterExpression: logsChartQuery } = useGetK8sEntityUid('kubernetes.deployment', snapshotId, timeConfig);

  const { usage, limits, requests, pending, allocated, unscheduled, unready, available, desired } = k8sChartColors;

  const comparisonColors = {
    comparisonDecreaseColor: blue.id,
    comparisonIncreaseColor: blue.id
  };

  const type = plugins.kubernetesDeployment;
  const idTag = tagEquals('id.kubernetesDeployment', snapshotId);
  const tagFilterExpression = toBackendQueryModel(andQuery(idTag));

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

  const viewAllHref = useDeploymentDashboard(snapshotId, { tab: '/conditions' });

  return (
    <>
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
                ...defaultChartMetricConfig,
                ...isContainerMetric
              },
              {
                metric: 'pods.required_cpu',
                label: t('in-kubernetes:dashboards.requests'),
                color: requests,
                ...defaultChartMetricConfig
              },
              {
                metric: 'pods.limit_cpu',
                label: t('in-kubernetes:dashboards.limits'),
                color: limits,
                ...defaultChartMetricConfig
              }
            ]}
            title={t('in-kubernetes:dashboards.cpuResources')}
            colors={[usage, requests, limits]}
            formatter="number.detailed"
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
                metric: 'pods.required_mem',
                label: t('in-kubernetes:dashboards.requests'),
                color: requests,
                ...defaultChartMetricConfig
              },
              {
                metric: 'pods.limit_mem',
                label: t('in-kubernetes:dashboards.limits'),
                color: limits,
                ...defaultChartMetricConfig
              }
            ]}
            title={t('in-kubernetes:dashboards.memoryResources')}
            colors={[usage, requests, limits]}
            formatter="bytes.detailed"
            tooltipFormatter={resourceQuotaBytes}
            paramTab="memTab"
            paramMetric="memMetric"
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
        <Col lg={6}>
          <KubernetesTimeShiftChartPresenter
            metrics={[
              {
                metric: 'availableReplicas',
                label: t('in-kubernetes:dashboards.available'),
                ...defaultChartMetricConfig
              },
              {
                metric: 'desiredReplicas',
                label: t('in-kubernetes:dashboards.desired'),
                ...defaultChartMetricConfig,
                color: desired
              }
            ]}
            title={t('in-kubernetes:dashboards.replicas')}
            colors={[available, desired]}
            formatter="number.compact"
            tooltipFormatter={number.compact}
            paramTab="replicasTab"
            paramMetric="replicasMetric"
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
                metric: 'duration',
                label: t('in-kubernetes:dashboards.pendingPhaseDuration'),
                color: allocated,
                ...defaultChartMetricConfig
              }
            ]}
            title={t('in-kubernetes:dashboards.pendingPhaseDuration')}
            colors={[allocated]}
            formatter="millis.detailed"
            tooltipFormatter={msFormatter}
            paramTab="pendingTab"
            paramMetric="pendingMetric"
            path={summaryTab}
            hasActionlane
            snapshotId={snapshotId}
            hasButtonInActionslane={false}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <ConditionsTableCard conditions={deployment.conditions} viewAllHref={viewAllHref} />
        </Col>
      </Row>
    </>
  );
}
