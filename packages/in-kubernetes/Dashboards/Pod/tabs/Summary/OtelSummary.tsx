/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { AggregationType, KubernetesPod, ResultType, TimeConfig } from '@instana/types';
import { Card } from '@instana/components';

import {
  andQuery,
  LogsChartInteractionWrapper,
  tagEquals
} from 'in-kubernetes/Dashboards/commonComponents/LogsChartInteractionWrapper';
// @ts-expect-error
import { source } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/metrics';
import { bytes, percentage, timeBySecondsTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import KubernetesTimeShiftChartPresenter from 'in-kubernetes/Dashboards/commonComponents/KubernetesTimeShiftChartPresenter';
// @ts-expect-error
import MissingK8sPermissions from 'in-kubernetes/Dashboards/commonComponents/MissingK8sPermissions';
// @ts-expect-error
import ConditionsTableCard from 'in-kubernetes/Dashboards/commonComponents/ConditionsTableCard';
// @ts-expect-error
import ContainerStates from 'in-kubernetes/Dashboards/Pod/tabs/Summary/ContainerStates';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { k8sPodAndServiceChart, k8sNodeChart } from 'in-kubernetes/components/K8sChartColors';
import { resourceQuotaBytes, resourceQuotaPercentage } from 'in-kubernetes/formatters';
import { useGetK8sEntityUid } from 'in-kubernetes/Dashboards/useGetK8sEntityUid';
import { summaryTab, useOtelPodDashboard } from 'in-kubernetes/navigation/paths';
import { blue } from 'in-custom-dashboards/widgets/BigNumber/comparisonColors';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { formatDuration } from 'in-services/formatters/date';
import { capitalizeValue } from 'in-components/Capitalize';
import { getChartGranularity } from 'in-stores/metric';
import { Col, Row } from 'in-components/layout/Grid';
import MetricValue from 'in-components/MetricValue';
import KpiCard from 'in-components/KpiCard/KpiCard';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

import locals from './Summary.mless';

interface SummaryProps {
  data: KubernetesPod;
  timeConfig: TimeConfig;
}

export default function OtelSummary({ data: pod, timeConfig }: SummaryProps) {
  const timeShift = useTimeShiftConfig();
  const snapshotId = pod.id;

  const containerStatuses = pod.status?.containerStatuses || [];
  const kpiWidth = 2;

  const podTagId = tagEquals('id.oTelK8sPod', snapshotId);
  const podQuery = andQuery(podTagId);
  const tagFilterExpression = toBackendQueryModel(podQuery);

  const { tagFilterExpression: logsChartQuery } = useGetK8sEntityUid('kubernetes.pod', snapshotId, timeConfig);

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

  const viewAllHref = useOtelPodDashboard(pod.id, { tab: '/conditions' });

  return (
    <>
      <MissingK8sPermissions resourceSnapshotId={pod.id} timeConfig={timeConfig} />
      <KpiGridRow sizes={[3, 3, 2, 2, 2]}>
        <KpiCard
          title={t('in-kubernetes:dashboards.status')}
          value={pod.status?.statusSummary}
          renderValue={capitalizeValue}
          borderless
          raw
        />
        <KpiCard
          title={t('in-kubernetes:dashboards.phase')}
          value={pod.status?.phase}
          renderValue={capitalizeValue}
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
          value={pod.id}
          renderValue={podId => <MetricValue snapshotId={podId} metric="restartCount" formatter={zeroDecimalPlaces} />}
          borderless
          raw
        />
        <KpiCard
          title={t('in-kubernetes:dashboards.age')}
          value={pod.age}
          renderValue={formatDuration}
          borderless
          raw
        />
      </KpiGridRow>
      {pod.status?.message && (
        <Row>
          <Col lg={12}>
            <KpiCard
              title={t('in-kubernetes:dashboards.statusMessage')}
              valuesClassName={locals.message}
              value={pod.status?.message}
              raw
            />
          </Col>
        </Row>
      )}
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
      <Row>
        <Col lg={12}>
          <LogsChartInteractionWrapper tagFilterExpression={logsChartQuery} timeConfig={timeConfig} />
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
          <ConditionsTableCard conditions={pod.conditions} viewAllHref={viewAllHref} />
        </Col>
      </Row>
    </>
  );
}
