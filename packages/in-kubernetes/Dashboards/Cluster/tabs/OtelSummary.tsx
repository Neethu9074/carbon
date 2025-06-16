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
// @ts-expect-error
import { isOpenshift } from 'in-kubernetes/clusterDistributions';
import { blue } from 'in-custom-dashboards/widgets/BigNumber/comparisonColors';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { percentage } from 'in-services/formatters/number';
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

  return (
    <>
      <MissingK8sPermissions cluster={cluster} />
      <Row>
        <Col lg={2}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.cpuRequests')}
            formatter={percentage.detailed}
            config={{
              metricConfiguration: {
                metric: 'requiredCapacityCPURatio',
                ...defaultBigNumberMetricConfig
              },
              ...comparisonColors
            }}
            raw
          />
        </Col>
        <Col lg={2}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.cpuLimitsAlloc')}
            formatter={percentage.detailed}
            config={{
              metricConfiguration: {
                metric: 'limitCapacityCPURatio',
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
            formatter={percentage.detailed}
            config={{
              metricConfiguration: {
                metric: 'requiredCapacityMemoryRatio',
                ...defaultBigNumberMetricConfig
              },
              ...comparisonColors
            }}
            raw
          />
        </Col>
        <Col lg={2}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.memoryLimitsAlloc')}
            formatter={percentage.detailed}
            config={{
              metricConfiguration: {
                metric: 'limitCapacityMemoryRatio',
                ...defaultBigNumberMetricConfig
              },
              ...comparisonColors
            }}
            raw
          />
        </Col>
        <Col lg={2}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.podsAlloc')}
            formatter={percentage.detailed}
            config={{
              metricConfiguration: {
                metric: 'allocatedCapacityPodsRatio',
                ...defaultBigNumberMetricConfig
              },
              ...comparisonColors
            }}
            raw
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
