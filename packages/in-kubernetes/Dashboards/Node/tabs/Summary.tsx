/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { AggregationType, KubernetesNode, ResultType, TimeConfig } from '@instana/types';

// @ts-expect-error
import { source } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/metrics';
// @ts-expect-error
import { TimeShiftAwareChartSelectorWithUrlState } from 'in-applications/Dashboards/commonComponents/ChartSelectors';
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
import NodesChartPresenter from 'in-kubernetes/Dashboards/Node/tabs/NodesChartPresenter';
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

  const comparisonColors = {
    comparisonDecreaseColor: blue.id,
    comparisonIncreaseColor: blue.id
  };

  const cpuResourcesTabId = 'cpuResources';
  const memoryResourcesTabId = 'memoryResources';
  const podAllocTabId = 'podAllocation';

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
          <TimeShiftAwareChartSelectorWithUrlState
            cardTitle={t('in-kubernetes:labelCpuResources')}
            tabs={[
              {
                id: cpuResourcesTabId,
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
                value: 'required_cpu',
                tab: cpuResourcesTabId
              },
              {
                id: 'cpuLimits',
                label: t('in-kubernetes:dashboards.limits'),
                value: 'limit_cpu',
                tab: cpuResourcesTabId
              },
              {
                id: 'cpuCapacity',
                label: t('in-kubernetes:dashboards.capacity'),
                value: 'cap_cpu',
                tab: cpuResourcesTabId
              }
            ]}
            urlMatrixParamConfig={{ path: summaryTab, paramTab: 'cpuTab', paramMetric: 'cpuMetric' }}
          >
            <NodesChartPresenter
              metrics={[
                {
                  metric: 'cpu.total_usage',
                  label: t('in-kubernetes:dashboards.usage'),
                  color: usage,
                  ...defaultMetricConfig
                },
                {
                  metric: 'required_cpu',
                  label: t('in-kubernetes:dashboards.requests'),
                  color: requests,
                  ...defaultMetricConfig
                },
                {
                  metric: 'limit_cpu',
                  label: t('in-kubernetes:dashboards.limits'),
                  color: limits,
                  ...defaultMetricConfig
                },
                {
                  metric: 'cap_cpu',
                  label: t('in-kubernetes:dashboards.capacity'),
                  color: capacity,
                  ...defaultMetricConfig
                }
              ]}
              title={t('in-kubernetes:dashboards.cpuResources')}
              colors={[usage, requests, limits, capacity]}
              formatter="number.detailed"
              tooltipFormatter={number.detailed}
            />
          </TimeShiftAwareChartSelectorWithUrlState>
        </Col>
        <Col lg={4}>
          <TimeShiftAwareChartSelectorWithUrlState
            cardTitle={t('in-kubernetes:labelMemoryResources')}
            tabs={[
              {
                id: memoryResourcesTabId,
                label: t('in-kubernetes:labelMemoryResources')
              }
            ]}
            metrics={[
              {
                id: 'memoryUsage',
                label: t('in-kubernetes:dashboards.usage'),
                value: 'memory.usage',
                tab: memoryResourcesTabId,
                tabDefault: true
              },
              {
                id: 'memoryRequests',
                label: t('in-kubernetes:dashboards.requests'),
                value: 'required_mem',
                tab: memoryResourcesTabId
              },
              {
                id: 'memoryLimits',
                label: t('in-kubernetes:dashboards.limits'),
                value: 'limit_mem',
                tab: memoryResourcesTabId
              },
              {
                id: 'memoryCapacity',
                label: t('in-kubernetes:dashboards.capacity'),
                value: 'cap_mem',
                tab: memoryResourcesTabId
              }
            ]}
            urlMatrixParamConfig={{ path: summaryTab, paramTab: 'memoryTab', paramMetric: 'memoryMetric' }}
          >
            <NodesChartPresenter
              metrics={[
                {
                  metric: 'memory.usage',
                  label: t('in-kubernetes:dashboards.usage'),
                  color: usage,
                  ...defaultMetricConfig
                },
                {
                  metric: 'required_mem',
                  label: t('in-kubernetes:dashboards.requests'),
                  color: requests,
                  ...defaultMetricConfig
                },
                {
                  metric: 'limit_mem',
                  label: t('in-kubernetes:dashboards.limits'),
                  color: limits,
                  ...defaultMetricConfig
                },
                {
                  metric: 'cap_mem',
                  label: t('in-kubernetes:dashboards.capacity'),
                  color: capacity,
                  ...defaultMetricConfig
                }
              ]}
              title={t('in-kubernetes:dashboards.memoryResources')}
              colors={[usage, requests, limits, capacity]}
              formatter="bytes.detailed"
              tooltipFormatter={bytes.detailed}
            />
          </TimeShiftAwareChartSelectorWithUrlState>
        </Col>
        <Col lg={4}>
          <TimeShiftAwareChartSelectorWithUrlState
            cardTitle={t('in-kubernetes:labelAllocatedPods')}
            tabs={[
              {
                id: podAllocTabId,
                label: t('in-kubernetes:labelAllocatedPods')
              }
            ]}
            metrics={[
              {
                id: 'podAllocation',
                label: t('in-kubernetes:dashboards.allocated'),
                value: 'allocatedPods',
                tab: podAllocTabId,
                tabDefault: true
              },
              {
                id: 'capacityPods',
                label: t('in-kubernetes:dashboards.capacity'),
                value: 'cap_pods',
                tab: podAllocTabId
              }
            ]}
            urlMatrixParamConfig={{ path: summaryTab, paramTab: 'allocTab', paramMetric: 'allocMetric' }}
          >
            <NodesChartPresenter
              metrics={[
                {
                  metric: 'allocatedPods',
                  label: t('in-kubernetes:dashboards.allocated'),
                  color: usage,
                  ...defaultMetricConfig
                },
                {
                  metric: 'cap_pods',
                  label: t('in-kubernetes:dashboards.capacity'),
                  color: capacity,
                  ...defaultMetricConfig
                }
              ]}
              title={t('in-kubernetes:dashboards.podsAllocation')}
              colors={[usage, capacity]}
              formatter="number.compact"
              tooltipFormatter={number.compact}
            />
          </TimeShiftAwareChartSelectorWithUrlState>
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
