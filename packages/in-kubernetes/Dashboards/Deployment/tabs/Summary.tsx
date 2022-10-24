/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

// @ts-nocheck - block imports cannot be excluded unfortunately - https://github.com/Microsoft/TypeScript/issues/19573

import React, { Fragment } from 'react';

import { AggregationType, ResultType } from '@instana/types';

import {
  LogsChartInteractionWrapper,
  andQuery,
  kubernetesClusterTagEquals,
  kubernetesNamespaceTagEquals,
  tagEquals
} from 'in-kubernetes/Dashboards/commonComponents/LogsChartInteractionWrapper';
import { source } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/metrics';
import MissingK8sPermissions from 'in-kubernetes/Dashboards/commonComponents/MissingK8sPermissions';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { zeroDecimalPlaces, timeByMillisTwoDecimalPlaces } from 'in-services/formatters/number';
import ConditionsTableCard from 'in-kubernetes/Dashboards/commonComponents/ConditionsTableCard';
import { TimeShiftAwareChartSelectorWithUrlState } from 'in-components/ChartSelectors';
import { resourceQuotaNumber, resourceQuotaBytes } from 'in-kubernetes/formatters';
import { blue } from 'in-custom-dashboards/widgets/BigNumber/comparisonColors';
import { getDeploymentDashboard } from 'in-kubernetes/navigation/paths';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import DeploymentChartPresenter from './DeploymentChartPresenter';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { summaryTab } from 'in-kubernetes/navigation/paths';
import { getChartGranularity } from 'in-stores/metric';
import { Row, Col } from 'in-components/layout/Grid';
import { plugins } from 'in-forge/constants';
import theme from 'in-themes';
import { t } from 'in-i18n';

const noActivity = t('in-kubernetes:dashboards.noActivity');
const msFormatter = d => (d < 0 ? noActivity : timeByMillisTwoDecimalPlaces(d));

export default function Summary({ timeConfig, data: deployment }) {
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

  const cpuResourcesTabId = 'cpuResources';
  const memoryResourcesTabId = 'memoryResources';
  const podResourcesTabId = 'podResources';
  const replicasTabId = 'replicas';
  const pendingPhaseTabId = 'pendingPhase';

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
                id: 'podsRequiredCpu',
                label: t('in-kubernetes:dashboards.requests'),
                value: 'pods.required_cpu',
                tab: cpuResourcesTabId
              },
              {
                id: 'podsLimitCpu',
                label: t('in-kubernetes:dashboards.limits'),
                value: 'pods.limit_cpu',
                tab: cpuResourcesTabId
              }
            ]}
            urlMatrixParamConfig={{ path: summaryTab, paramTab: 'cpuTab', paramMetric: 'cpuMetric' }}
          >
            <DeploymentChartPresenter
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
                id: 'memUsage',
                label: t('in-kubernetes:dashboards.usage'),
                value: 'memory.usage',
                tab: memoryResourcesTabId,
                tabDefault: true
              },
              {
                id: 'podsRequiredMem',
                label: t('in-kubernetes:dashboards.requests'),
                value: 'pods.required_mem',
                tab: memoryResourcesTabId
              },
              {
                id: 'podsLimitMem',
                label: t('in-kubernetes:dashboards.limits'),
                value: 'pods.limit_mem',
                tab: memoryResourcesTabId
              }
            ]}
            urlMatrixParamConfig={{ path: summaryTab, paramTab: 'memTab', paramMetric: 'memMetric' }}
          >
            <DeploymentChartPresenter
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
            />
          </TimeShiftAwareChartSelectorWithUrlState>
        </Col>
        <Col lg={4}>
          <TimeShiftAwareChartSelectorWithUrlState
            cardTitle={t('in-kubernetes:dashboards.pods')}
            tabs={[
              {
                id: 'podResources',
                label: t('in-kubernetes:dashboards.pods')
              }
            ]}
            metrics={[
              {
                id: 'podsCount',
                label: t('in-kubernetes:dashboards.allocated'),
                value: 'pods.count',
                tab: podResourcesTabId,
                tabDefault: true
              },
              {
                id: 'phasePendingCount',
                label: t('in-kubernetes:dashboards.pending'),
                value: 'phase.Pending.count',
                tab: podResourcesTabId
              },
              {
                id: 'conditionsPodScheduled',
                label: t('in-kubernetes:dashboards.unscheduled'),
                value: 'conditions.PodScheduled.False',
                tab: podResourcesTabId
              },
              {
                id: 'conditionsReady',
                label: t('in-kubernetes:dashboards.unready'),
                value: 'conditions.Ready.False',
                tab: podResourcesTabId
              }
            ]}
            urlMatrixParamConfig={{ path: summaryTab, paramTab: 'podTab', paramMetric: 'podMetric' }}
          >
            <DeploymentChartPresenter
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
              formatter={zeroDecimalPlaces}
              tooltipFormatter={zeroDecimalPlaces}
            />
          </TimeShiftAwareChartSelectorWithUrlState>
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
          <TimeShiftAwareChartSelectorWithUrlState
            cardTitle={t('in-kubernetes:dashboards.replicas')}
            tabs={[
              {
                id: 'replicas',
                label: t('in-kubernetes:dashboards.replicas')
              }
            ]}
            metrics={[
              {
                id: 'availableReplicas',
                label: t('in-kubernetes:dashboards.available'),
                value: 'availableReplicas',
                tab: replicasTabId,
                tabDefault: true
              },
              {
                id: 'desiredReplicas',
                label: t('in-kubernetes:dashboards.desired'),
                value: 'desiredReplicas',
                tab: replicasTabId
              }
            ]}
            urlMatrixParamConfig={{ path: summaryTab, paramTab: 'replicasTab', paramMetric: 'replicasMetric' }}
          >
            <DeploymentChartPresenter
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
              formatter={zeroDecimalPlaces}
              tooltipFormatter={zeroDecimalPlaces}
            />
          </TimeShiftAwareChartSelectorWithUrlState>
        </Col>
        <Col lg={6}>
          <TimeShiftAwareChartSelectorWithUrlState
            cardTitle={t('in-kubernetes:dashboards.pendingPhaseDuration')}
            tabs={[
              {
                id: 'pendingPhase',
                label: t('in-kubernetes:dashboards.pendingPhaseDuration')
              }
            ]}
            metrics={[
              {
                id: 'pendingPhase',
                label: t('in-kubernetes:dashboards.pendingPhaseDuration'),
                value: 'duration',
                tab: pendingPhaseTabId,
                tabDefault: true
              }
            ]}
            urlMatrixParamConfig={{ path: summaryTab, paramTab: 'pendingTab', paramMetric: 'pendingMetric' }}
          >
            <DeploymentChartPresenter
              metrics={[
                {
                  metric: 'duration',
                  label: t('in-kubernetes:dashboards.pendingPhaseDuration'),
                  color: allocated,
                  ...defaultMetricConfig
                }
              ]}
              title={t('in-kubernetes:dashboards.pendingPhaseDuration')}
              formatter="number.detailed"
              tooltipFormatter={msFormatter}
            />
          </TimeShiftAwareChartSelectorWithUrlState>
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
