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
import { zeroDecimalPlaces, twoDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import MissingK8sPermissions from 'in-kubernetes/Dashboards/commonComponents/MissingK8sPermissions';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import ConditionsTableCard from 'in-kubernetes/Dashboards/commonComponents/ConditionsTableCard';
import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import ContainerStates from 'in-kubernetes/Dashboards/Pod/tabs/Summary/ContainerStates';
import K8DashboardsMarkerLanes from 'in-kubernetes/Dashboards/K8DashboardsMarkerLanes';
import { resourceQuotaBytes, resourceQuotaNumber } from 'in-kubernetes/formatters';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import { getPodDashboard } from 'in-kubernetes/navigation/paths';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { formatDuration } from 'in-services/formatters/date';
import { getChartGranularity } from 'in-stores/metric';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import MetricValue from 'in-components/MetricValue';
import Capitalize from 'in-components/Capitalize';
import { line } from 'in-stores/metric/renderer';
import { plugins } from 'in-forge/constants';
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

  const type = plugins.kubernetesPod;

  const defaultMetricConfig = {
    granularity: getChartGranularity(timeConfig),
    aggregation: 'MEAN',
    source: source,
    tagFilterExpression,
    timeConfig,
    timeShift: 0,
    type
  };

  const metricConfigsCpuResources = [
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
      crossSeriesAggregation: 'SUM'
    },
    {
      metric: 'memoryRequests',
      label: t('in-kubernetes:dashboards.requests'),
      ...defaultMetricConfig
    },
    {
      metric: 'memoryLimits',
      label: t('in-kubernetes:dashboards.limits'),
      ...defaultMetricConfig
    }
  ];

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
                source: 'INFRASTRUCTURE_METRICS',
                metric: 'cpu.total_usage',
                aggregation: 'MEAN',
                tagFilterExpression
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
                source: 'INFRASTRUCTURE_METRICS',
                metric: 'cpuRequests',
                aggregation: 'MEAN',
                tagFilterExpression
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
                source: 'INFRASTRUCTURE_METRICS',
                metric: 'cpuLimits',
                aggregation: 'MEAN',
                tagFilterExpression
              }
            }}
            raw
          />
        </Col>
        <Col lg={kpiWidth}>
          {/* TO DO */}
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.memoryUsage')}
            formatter={bytesTwoDecimalPlaces}
            config={{
              metricConfiguration: {
                source: 'INFRASTRUCTURE_METRICS',
                metric: 'memory.usage',
                aggregation: 'MEAN',
                // crossSeriesAggregation: 'SUM',
                tagFilterExpression
              }
            }}
            raw
          />
          {/* <KpiCard
            title={t('in-kubernetes:dashboards.memoryUsage')}
            value={<MetricValue snapshotId={pod.id} metric="memory.usage" formatter={bytesTwoDecimalPlaces} />}
            raw
          /> */}
        </Col>
        <Col lg={kpiWidth}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.memoryRequests')}
            formatter={resourceQuotaBytes}
            config={{
              metricConfiguration: {
                source: 'INFRASTRUCTURE_METRICS',
                metric: 'memoryRequests',
                aggregation: 'MEAN',
                tagFilterExpression
              }
            }}
            raw
          />
          {/* <KpiCard
            title={t('in-kubernetes:dashboards.memoryRequests')}
            value={<MetricValue snapshotId={pod.id} metric="memoryRequests" formatter={resourceQuotaBytes} />}
            raw
          /> */}
        </Col>
        <Col lg={kpiWidth}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.memoryLimits')}
            formatter={resourceQuotaBytes}
            config={{
              metricConfiguration: {
                source: 'INFRASTRUCTURE_METRICS',
                metric: 'memoryLimits',
                aggregation: 'MEAN',
                tagFilterExpression
              }
            }}
            raw
          />
          {/* <KpiCard
            title={t('in-kubernetes:dashboards.memoryLimits')}
            value={<MetricValue snapshotId={pod.id} metric="memoryLimits" formatter={resourceQuotaBytes} />}
            raw
          /> */}
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <UnifiedMetricsChart
            title={t('in-kubernetes:dashboards.cpuResources')}
            timeConfig={timeConfig}
            config={{
              y1: {
                metrics: metricConfigsCpuResources,
                formatter: resourceQuotaNumber,
                tooltipFormatter: resourceQuotaNumber,
                renderer: line.id
              },
              reverseOrder: true,
              type: 'TIME_SERIES'
            }}
            renderPostChartContent={K8DashboardsMarkerLanes}
          />
        </Col>
        <Col lg={6}>
          <UnifiedMetricsChart
            title={t('in-kubernetes:dashboards.memoryResources')}
            timeConfig={timeConfig}
            config={{
              y1: {
                metrics: metricConfigsMemoryResources,
                formatter: resourceQuotaNumber,
                tooltipFormatter: resourceQuotaNumber,
                renderer: line.id
              },
              reverseOrder: true,
              type: 'TIME_SERIES'
            }}
            renderPostChartContent={K8DashboardsMarkerLanes}
          />
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
