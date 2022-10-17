/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';

import { Card } from '@instana/components';

import {
  LogsChartInteractionWrapper,
  tagEquals,
  andQuery,
  kubernetesClusterTagEquals,
  kubernetesNamespaceTagEquals
} from 'in-kubernetes/Dashboards/commonComponents/LogsChartInteractionWrapper';
import { source } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/metrics';
import { TimeShiftAwareChartSelectorWithUrlState } from 'in-applications/Dashboards/commonComponents/ChartSelectors';
import { zeroDecimalPlaces, twoDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import MissingK8sPermissions from 'in-kubernetes/Dashboards/commonComponents/MissingK8sPermissions';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import ConditionsTableCard from 'in-kubernetes/Dashboards/commonComponents/ConditionsTableCard';
import PodsChartPresenter from 'in-kubernetes/Dashboards/Pod/tabs/Summary/PodsChartPresenter';
import ContainerStates from 'in-kubernetes/Dashboards/Pod/tabs/Summary/ContainerStates';
import { resourceQuotaBytes, resourceQuotaNumber } from 'in-kubernetes/formatters';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import { getPodDashboard } from 'in-kubernetes/navigation/paths';
import { summaryTab } from 'in-applications/navigation/paths';
import { number, bytes } from 'in-services/formatters/number';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { formatDuration } from 'in-services/formatters/date';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { getChartGranularity } from 'in-stores/metric';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import MetricValue from 'in-components/MetricValue';
import Capitalize from 'in-components/Capitalize';
import { plugins } from 'in-forge/constants';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './Summary.mless';

export default function Summary({ data: pod, timeConfig }) {
  const snapshotId = pod.id;
  const message = get(pod, ['status', 'message']);
  const containerStatuses = get(pod, ['status', 'containerStatuses'], []);
  const kpiWidth = 2;

  const clusterTag = kubernetesClusterTagEquals(pod.clusterId);
  const nsTag = kubernetesNamespaceTagEquals(pod.namespace);
  const podTag = tagEquals('kubernetes.pod.name', pod.label);
  const tagFilterExpression = toBackendQueryModel(andQuery(clusterTag, nsTag, podTag));
  const timeShift = useTimeShiftConfig();

  const type = plugins.kubernetesPod;

  const defaultBigNumberMetricConfig = {
    source: 'INFRASTRUCTURE_METRICS',
    aggregation: 'MEAN',
    tagFilterExpression,
    type
  };

  const isContainerMetric = {
    /* use this configuration on containers of this pod (which can be of type docker, containerd or crio)
      type filtering must be disabled and cross series aggregation uses SUM */
    type: undefined,
    crossSeriesAggregation: 'SUM'
  };

  const defaultMetricConfig = {
    granularity: getChartGranularity(timeConfig),
    aggregation: 'MEAN',
    source: source,
    tagFilterExpression,
    timeConfig,
    timeShift: 0,
    type
  };
  const { orange800: limits, lime800: requests, lightBlue800: usage } = theme.lib.colors;
  let colors = [usage, requests, limits];

  const tabCpuResourcesCodes = {
    id: 'cpuResources',
    label: t('in-kubernetes:labelCpuResources')
  };

  const tabMemoryResourcesCodes = {
    id: 'memoryResources',
    label: t('in-kubernetes:labelMemoryResources')
  };

  const cpuMetrics = [
    {
      id: 'cpuUsage',
      label: t('in-kubernetes:dashboards.usage'),
      value: 'cpu.total_usage',
      tab: tabCpuResourcesCodes.id,
      tabDefault: true
    },
    {
      id: 'cpuRequests',
      label: t('in-kubernetes:dashboards.requests'),
      value: 'cpuRequests',
      tab: tabCpuResourcesCodes.id
    },
    {
      id: 'cpuLimits',
      label: t('in-kubernetes:dashboards.cpuLimits'),
      value: 'cpuLimits',
      tab: tabCpuResourcesCodes.id
    }
  ];

  const memoryMetrics = [
    {
      id: 'memoryUsage',
      label: t('in-kubernetes:dashboards.usage'),
      value: 'memory.total_usage',
      tab: tabMemoryResourcesCodes.id,
      tabDefault: true
    },
    {
      id: 'memoryRequests',
      label: t('in-kubernetes:dashboards.requests'),
      value: 'memoryRequests',
      tab: tabMemoryResourcesCodes.id
    },
    {
      id: 'memoryLimits',
      label: t('in-kubernetes:dashboards.memoryLimits'),
      value: 'memoryLimits',
      tab: tabMemoryResourcesCodes.id
    }
  ];

  let metricConfigsCpuResources = [
    {
      metric: 'cpu.total_usage',
      label: t('in-kubernetes:dashboards.usage'),
      ...defaultMetricConfig,
      /* this metric is on containers for this pod which can be of type docker, containerd or crio
      type filtering must be disabled and cross series aggregation uses SUM */
      type: undefined,
      crossSeriesAggregation: 'SUM'
    },
    {
      metric: 'cpuRequests',
      label: t('in-kubernetes:dashboards.requests'),
      ...defaultMetricConfig
    },
    {
      metric: 'cpuLimits',
      label: t('in-kubernetes:dashboards.limits'),
      ...defaultMetricConfig
    }
  ];

  const metricConfigsMemoryResources = [
    {
      metric: 'memory.usage',
      label: t('in-kubernetes:dashboards.usage'),
      ...defaultMetricConfig,
      /* this metric is on containers for this pod which can be of type docker, containerd or crio
      type filtering must be disabled and cross series aggregation uses SUM */
      type: undefined,
      crossSeriesAggregation: 'SUM',
      color: usage
    },
    {
      metric: 'memoryRequests',
      label: t('in-kubernetes:dashboards.requests'),
      ...defaultMetricConfig,
      color: requests
    },
    {
      metric: 'memoryLimits',
      label: t('in-kubernetes:dashboards.limits'),
      ...defaultMetricConfig,
      color: limits
    }
  ];

  const urlMatrixParamConfigCpu = { path: summaryTab, paramTab: 'cpuTab', paramMetric: 'cpuMetric' };
  const urlMatrixParamConfigMemory = { path: summaryTab, paramTab: 'memoryTab', paramMetric: 'memoryMetric' };
  const tabCpu = {
    id: 'cpuResources',
    label: t('in-kubernetes:labelCpuResources')
  };

  const tabMemory = {
    id: 'memoryResources',
    label: t('in-kubernetes:labelMemoryResources')
  };

  const cpuOnlyTab = [tabCpu];
  const memoryOnlyTab = [tabMemory];
  const cpuCardTitle = t('in-kubernetes:labelCpuResources');
  const memoryCardTitle = t('in-kubernetes:labelMemoryResources');

  return (
    <Fragment>
      <MissingK8sPermissions resourceSnapshotId={pod.id} timeConfig={timeConfig} />

      <KpiGridRow sizes={[3, 3, 2, 2, 2]}>
        <KpiCard
          title={t('in-kubernetes:dashboards.status')}
          value={<Capitalize>{get(pod, ['status', 'statusSummary'], valueMissingPlaceholder)}</Capitalize>}
          borderless
          raw
        />
        <KpiCard
          title={t('in-kubernetes:dashboards.phase')}
          value={<Capitalize>{get(pod, ['status', 'phase'], pod.phase)}</Capitalize>}
          borderless
          raw
        />
        <KpiCard
          title={t('in-kubernetes:dashboards.readySummary')}
          value={`${containerStatuses.filter(c => c.ready).length}/${containerStatuses.length}`}
          borderless
          raw
        />
        <KpiCard
          title={t('in-kubernetes:dashboards.restarts')}
          value={<MetricValue snapshotId={pod.id} metric="restartCount" formatter={zeroDecimalPlaces} />}
          borderless
          raw
        />
        <KpiCard
          title={t('in-kubernetes:dashboards.age')}
          value={pod.age ? formatDuration(pod.age) : valueMissingPlaceholder}
          borderless
          raw
        />
      </KpiGridRow>

      {message && (
        <Row>
          <Col lg={12}>
            <KpiCard
              title={t('in-kubernetes:dashboards.statusMessage')}
              valuesClassName={locals.message}
              value={message}
              raw
            />
          </Col>
        </Row>
      )}

      <Row>
        <Col lg={kpiWidth}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.cpuUsage')}
            formatter={twoDecimalPlaces}
            config={{
              metricConfiguration: {
                metric: 'cpu.total_usage',
                ...defaultBigNumberMetricConfig,
                ...isContainerMetric,
                timeShift: timeShift.offset
              }
            }}
            raw
          />
        </Col>
        <Col lg={kpiWidth}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.cpuRequests')}
            formatter={resourceQuotaNumber}
            config={{
              metricConfiguration: {
                metric: 'cpuRequests',
                ...defaultBigNumberMetricConfig,
                timeShift: timeShift.offset
              }
            }}
            raw
          />
        </Col>
        <Col lg={kpiWidth}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.cpuLimits')}
            formatter={resourceQuotaNumber}
            config={{
              metricConfiguration: {
                metric: 'cpuLimits',
                ...defaultBigNumberMetricConfig,
                timeShift: timeShift.offset
              }
            }}
            raw
          />
        </Col>
        <Col lg={kpiWidth}>
          {/* TO DO: WIP */}
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.memoryUsage')}
            formatter={bytesTwoDecimalPlaces}
            config={{
              metricConfiguration: {
                metric: 'memory.usage',
                ...defaultBigNumberMetricConfig,
                ...isContainerMetric,
                timeShift: timeShift.offset
              }
            }}
            raw
          />
        </Col>
        <Col lg={kpiWidth}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.memoryRequests')}
            formatter={resourceQuotaBytes}
            config={{
              metricConfiguration: {
                metric: 'memoryRequests',
                ...defaultBigNumberMetricConfig,
                timeShift: timeShift.offset
              }
            }}
            raw
          />
        </Col>
        <Col lg={kpiWidth}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.memoryLimits')}
            formatter={resourceQuotaBytes}
            config={{
              metricConfiguration: {
                metric: 'memoryLimits',
                ...defaultBigNumberMetricConfig,
                timeShift: timeShift.offset
              }
            }}
            raw
          />
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <TimeShiftAwareChartSelectorWithUrlState
            cardTitle={cpuCardTitle}
            tabs={cpuOnlyTab}
            metrics={cpuMetrics}
            urlMatrixParamConfig={urlMatrixParamConfigCpu}
          >
            <PodsChartPresenter
              metrics={metricConfigsCpuResources}
              title={t('in-kubernetes:dashboards.cpuResources')}
              timeConfig={timeConfig}
              colors={colors}
              formatter="number.detailed"
              tooltipFormatter={number.detailed}
            />
          </TimeShiftAwareChartSelectorWithUrlState>
        </Col>
        <Col lg={6}>
          <TimeShiftAwareChartSelectorWithUrlState
            cardTitle={memoryCardTitle}
            tabs={memoryOnlyTab}
            metrics={memoryMetrics}
            urlMatrixParamConfig={urlMatrixParamConfigMemory}
          >
            <PodsChartPresenter
              metrics={metricConfigsMemoryResources}
              title={t('in-kubernetes:dashboards.memoryResources')}
              timeConfig={timeConfig}
              colors={colors}
              formatter="bytes.detailed"
              tooltipFormatter={bytes.detailed}
            />
          </TimeShiftAwareChartSelectorWithUrlState>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <LogsChartInteractionWrapper
            tagFilterExpression={andQuery(clusterTag, nsTag, podTag)}
            timeConfig={timeConfig}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <Card title={t('in-kubernetes:dashboards.containerStatus')} useMaxAvailableHeight>
            <ContainerStates pod={pod} timeConfig={timeConfig} />
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <ConditionsTableCard
            conditions={pod.conditions}
            viewAllHref$={getPodDashboard(snapshotId, { tab: '/conditions' })}
          />
        </Col>
      </Row>
    </Fragment>
  );
}
