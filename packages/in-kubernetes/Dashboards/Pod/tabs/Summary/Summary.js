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
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './Summary.mless';

//TODO: WIP
// import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
// import useUrlState from 'in-hooks/useUrlState';
// import { summaryTab } from 'in-applications/navigation/paths';
// import { urlParameter as timeShiftUrlParameter } from 'in-stores/time/shifting';

export default function Summary({ data: pod, timeConfig }) {
  const snapshotId = pod.id;
  const message = get(pod, ['status', 'message']);
  const containerStatuses = get(pod, ['status', 'containerStatuses'], []);
  const { orange800: limits, lime800: requests, lightBlue800: usage } = theme.lib.colors;
  const kpiWidth = 2;

  const clusterTag = kubernetesClusterTagEquals(pod.clusterId);
  const nsTag = kubernetesNamespaceTagEquals(pod.namespace);
  const podTag = tagEquals('kubernetes.pod.name', pod.label);
  const tagFilterExpression = toBackendQueryModel(andQuery(clusterTag, nsTag, podTag));

  const type = plugins.kubernetesPod;

  const defaultChartMetricConfig = {
    granularity: getChartGranularity(timeConfig),
    aggregation: 'MEAN',
    source: source,
    tagFilterExpression,
    timeConfig,
    timeShift: 0,
    type
  };

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

  const metricConfigsCpuResources = [
    {
      metric: 'cpu.total_usage',
      label: t('in-kubernetes:dashboards.usage'),
      ...defaultChartMetricConfig,
      ...isContainerMetric
    },
    {
      metric: 'cpuRequests',
      label: t('in-kubernetes:dashboards.requests'),
      ...defaultChartMetricConfig
    },
    {
      metric: 'cpuLimits',
      label: t('in-kubernetes:dashboards.limits'),
      ...defaultChartMetricConfig
    }
  ];

  const metricConfigsMemoryResources = [
    {
      metric: 'memory.usage',
      label: t('in-kubernetes:dashboards.usage'),
      ...defaultChartMetricConfig,
      ...isContainerMetric
    },
    {
      metric: 'memoryRequests',
      label: t('in-kubernetes:dashboards.requests'),
      ...defaultChartMetricConfig
    },
    {
      metric: 'memoryLimits',
      label: t('in-kubernetes:dashboards.limits'),
      ...defaultChartMetricConfig
    }
  ];

  //TODO: WIP
  // const {path, paramTab, paramMetric} = { path: summaryTab, paramTab: 'callsTab', paramMetric: 'callsMetric' }
  // const urlStateDefinition = {
  //   bind: [
  //     {
  //       path: summaryTab,
  //       name: path,
  //       as: path
  //     },
  //     // {
  //     //   path: summaryTab,
  //     //   name: paramMetric,
  //     //   as: paramMetric
  //     // }
  //   ],
  //   resets: [
  //     {
  //       bind: [timeShiftUrlParameter],
  //       reset: ({ timeShiftOffset }) => {
  //         if (timeShiftOffset === 0) {
  //           return { [paramTab]: getActiveTab(), [paramMetric]: null };
  //         } else {
  //           return { [paramMetric]: getActiveMetric(), [paramTab]: null };
  //         }
  //       }
  //     }
  //   ]
  // };
  // const [{ [paramTab]: activeTab, [paramMetric]: activeMetric }, setUrlState] = useUrlState(urlStateDefinition);
  // const timeShiftConfig = useTimeShiftConfig();
  // let metricConfigs;
  // let renderer;
  // let colors;
  // if (timeShiftConfig.offset) {
  //   const findDefaultMetricByTab = tabId =>
  //   metrics.find(m => m.tab === tabId && m.tabDefault)?.id ??
  //   // otherwise, take the default metric of the first tab
  //   metrics.find(m => m.tab === tabs[0].id && m.tabDefault)?.id ??
  //   // otherwise, take the first metric of the first tab
  //   metrics.find(m => m.tab === tabs[0].id).id;
  //   const getActiveMetric = () => activeMetric ?? findDefaultMetricByTab(activeTab);

  //   timeShiftMetric = metrics.find(m => m.id === getActiveMetric())?.value
  //   const timeShiftChartMetric = chartMetrics.find(m => m.metric === timeShiftMetric) ?? chartMetrics[0];
  //   const timeShiftMetricConfig = {
  //     metric: timeShiftChartMetric.metric,
  //     label: timeShiftChartMetric.label,
  //     ...timeShiftChartMetric.config
  //   };
  //   metricConfigs = [
  //     {
  //       ...timeShiftMetricConfig,
  //       timeShift: timeShiftConfig.offset
  //     },
  //     // make sure the main metric renders over the time shifted metric
  //     {
  //       ...timeShiftMetricConfig
  //     }
  //   ];
  //   colors = [theme.lib.colors.timeShift, timeShiftChartMetric.color];
  //   renderer = line.id;
  // } else {
  //   metricConfigs = chartMetrics.map(m => ({
  //     metric: m.metric,
  //     label: m.label,
  //     ...m.config
  //   }));
  //   colors = chartMetrics.map(m => m.color);
  //   renderer = stackedBar.id;
  // }

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
                ...isContainerMetric
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
                ...defaultBigNumberMetricConfig
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
                ...defaultBigNumberMetricConfig
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
                ...isContainerMetric
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
                ...defaultBigNumberMetricConfig
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
                ...defaultBigNumberMetricConfig
              }
            }}
            raw
          />
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
                renderer: line.id,
                colors: [usage, requests, limits]
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
                renderer: line.id,
                colors: [usage, requests, limits]
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
