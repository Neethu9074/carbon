/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Map } from 'immutable';
import React from 'react';

import { AggregationType, KubernetesCluster, ResultType, TimeConfig } from '@instana/types';

// @ts-expect-error
import { source } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/metrics';
import KubernetesTimeShiftChartPresenter from 'in-kubernetes/Dashboards/commonComponents/KubernetesTimeShiftChartPresenter';
// @ts-expect-error
import MissingK8sPermissions from 'in-kubernetes/Dashboards/commonComponents/MissingK8sPermissions';
// @ts-expect-error
import TopDeploymentsList from 'in-kubernetes/Dashboards/commonComponents/TopDeploymentsList';
// @ts-expect-error
import TopNamespacesList from 'in-kubernetes/Dashboards/commonComponents/TopNamespacesList';
import { andQuery, tagEquals } from 'in-kubernetes/Dashboards/commonComponents/LogsChartInteractionWrapper';
// @ts-expect-error
import TopNodesList from 'in-kubernetes/Dashboards/commonComponents/TopNodesList';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import CustomMetricsV2, { AVAILABLE_SPECS } from 'in-sdk/components/dashboard/CustomMetricsV2';
import { k8sChartColors, k8sClusterChart } from 'in-kubernetes/components/K8sChartColors';
// @ts-expect-error
import { isOpenshift } from 'in-kubernetes/clusterDistributions';
import { percentage, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { blue } from 'in-custom-dashboards/widgets/BigNumber/comparisonColors';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import { Metric } from 'in-custom-dashboards/widgets/Chart/types';
import { k8sClusterUsageEnabled } from 'in-services/featureFlags';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { summaryTab } from 'in-kubernetes/navigation/paths';
import { getChartGranularity } from 'in-stores/metric';
import { Col, Row } from 'in-components/layout/Grid';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

interface SummaryProps {
  data: KubernetesCluster;
  timeConfig: TimeConfig;
}

export const SPECS = [AVAILABLE_SPECS.GAUGE, AVAILABLE_SPECS.HISTOGRAM, AVAILABLE_SPECS.SUM, AVAILABLE_SPECS.SUMMARY];

export default function Summary({ timeConfig, data: cluster }: SummaryProps) {
  const timeShift = useTimeShiftConfig();
  const snapshotId = cluster?.id;

  const { limits, requests, usage } = k8sChartColors;
  const { capacity } = k8sClusterChart;

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

  const clusterTagId = tagEquals('id.oTelK8sCluster', snapshotId);
  const tagFilterExpression = toBackendQueryModel(andQuery(clusterTagId));
  const type = plugins.oTelK8sCluster;

  const defaultBigNumberMetricConfig = {
    source,
    aggregation: 'MEAN' as AggregationType,
    tagFilterExpression,
    type,
    timeShift,
    timeConfig,
    resultType: 'SINGLE_NUMBER' as ResultType
  };

  const showUsage = k8sClusterUsageEnabled;

  function addUsageToMetrics(metricsArr: Metric[], metric: Metric) {
    if (showUsage) {
      metricsArr.push(metric);
      return metricsArr;
    } else {
      return metricsArr;
    }
  }

  const defaultMetricConfig = {
    granularity: getChartGranularity(timeConfig),
    aggregation: 'MEAN' as AggregationType,
    source,
    tagFilterExpression,
    timeConfig,
    timeShift: 0,
    type
  };

  return (
    <>
      <MissingK8sPermissions cluster={cluster} />
      <Row>
        <Col lg={2}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.cpuUtilization')}
            formatter={percentage.detailed}
            config={{
              metricConfiguration: {
                metric: 'k8s.cluster.cpu.utilization',
                ...defaultBigNumberMetricConfig
              },
              ...comparisonColors
            }}
            raw
          />
        </Col>
        <Col lg={2}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.memoryUsage')}
            formatter={bytesTwoDecimalPlaces}
            config={{
              metricConfiguration: {
                metric: 'k8s.cluster.memory.usage',
                ...defaultBigNumberMetricConfig
              },
              ...comparisonColors
            }}
            raw
          />
        </Col>
        <Col lg={2}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.memoryAvailable')}
            formatter={bytesTwoDecimalPlaces}
            config={{
              metricConfiguration: {
                metric: 'k8s.cluster.memory.available',
                ...defaultBigNumberMetricConfig
              },
              ...comparisonColors
            }}
            raw
          />
        </Col>
        <Col lg={2}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.filesystemCapacity')}
            formatter={bytesTwoDecimalPlaces}
            config={{
              metricConfiguration: {
                metric: 'k8s.cluster.filesystem.capacity',
                ...defaultBigNumberMetricConfig
              },
              ...comparisonColors
            }}
            raw
          />
        </Col>
        <Col lg={2}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.filesystemAvailable')}
            formatter={bytesTwoDecimalPlaces}
            config={{
              metricConfiguration: {
                metric: 'k8s.cluster.filesystem.available',
                ...defaultBigNumberMetricConfig
              },
              ...comparisonColors
            }}
            raw
          />
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={4}>
          <KubernetesTimeShiftChartPresenter
            metrics={addUsageToMetrics(
              [
                {
                  metric: 'k8s.cluster.cpu.utilization',
                  label: t('in-kubernetes:dashboards.cpuUtilization'),
                  color: requests,
                  ...defaultMetricConfig,
                  ...isContainerMetric
                }
              ],
              {
                metric: 'cpu.total_usage',
                label: t('in-kubernetes:dashboards.usage'),
                color: usage,
                ...defaultMetricConfig
              }
            )}
            title={t('in-kubernetes:dashboards.cpuResources')}
            colors={[requests, limits, capacity, usage]}
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
        <Col lg={4}>
          <KubernetesTimeShiftChartPresenter
            metrics={addUsageToMetrics(
              [
                {
                  metric: 'k8s.cluster.memory.usage',
                  label: t('in-kubernetes:dashboards.memoryUsage'),
                  color: requests,
                  ...defaultMetricConfig,
                  ...isContainerMetric
                },
                {
                  metric: 'k8s.cluster.memory.available',
                  label: t('in-kubernetes:dashboards.memoryAvailable'),
                  color: usage,
                  ...defaultMetricConfig
                }
              ],
              {
                metric: 'memory.usage',
                label: t('in-kubernetes:dashboards.usage'),
                color: usage,
                ...defaultMetricConfig
              }
            )}
            title={t('in-kubernetes:dashboards.memoryResources')}
            colors={[requests, limits, capacity, usage]}
            formatter="bytes.detailed"
            tooltipFormatter={bytesTwoDecimalPlaces}
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
                metric: 'k8s.cluster.filesystem.available',
                label: t('in-kubernetes:dashboards.filesystemAvailable'),
                color: capacity,
                ...defaultMetricConfig
              },
              {
                metric: 'k8s.cluster.filesystem.capacity',
                label: t('in-kubernetes:dashboards.filesystemCapacity'),
                color: requests,
                ...defaultMetricConfig,
                ...isContainerMetric
              }
            ]}
            title={t('in-kubernetes:dashboards.filesystemResources')}
            colors={[requests, limits, capacity]}
            formatter="bytes.detailed"
            tooltipFormatter={bytesTwoDecimalPlaces}
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
          <CustomMetricsV2
            snapshot={Map({ id: snapshotId })}
            timeConfig={timeConfig}
            titlePrefix={t('in-kubernetes:sourceSelector.additionalMetrics.title')}
            specs={SPECS}
          />
        </Col>
      </Row>
    </>
  );
}
