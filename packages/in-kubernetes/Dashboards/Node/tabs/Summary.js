/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { Card } from '@instana/components';

// TODO: will use this with TSX
// import {AggregationType, ResultType} from "@instana/types";
import { blue } from 'in-custom-dashboards/widgets/BigNumber/comparisonColors';
import {
  LogsChartInteractionWrapper,
  andQuery,
  kubernetesClusterTagEquals,
  tagEquals
} from 'in-kubernetes/Dashboards/commonComponents/LogsChartInteractionWrapper';
import { source } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/metrics';
import MissingK8sPermissions from 'in-kubernetes/Dashboards/commonComponents/MissingK8sPermissions';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import ConditionsTableCard from 'in-kubernetes/Dashboards/commonComponents/ConditionsTableCard';
import K8DashboardsMarkerLanes from 'in-kubernetes/Dashboards/K8DashboardsMarkerLanes';
import { resourceQuotaBytes, resourceQuotaNumber } from 'in-kubernetes/formatters';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { zeroDecimalPlaces, percentage } from 'in-services/formatters/number';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import { getNodeDashboard } from 'in-kubernetes/navigation/paths';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { formatDuration } from 'in-services/formatters/date';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import Capitalize from 'in-components/Capitalize';
import { plugins } from 'in-forge/constants';
import theme from 'in-themes';
import { t } from 'in-i18n';

export default function Summary({ timeConfig, data: node }) {
  const snapshotId = node.id;
  const { teal800: capacity, orange800: limits, lime800: requests, lightBlue800: usage } = theme.lib.colors;

  const clusterTag = kubernetesClusterTagEquals(node.clusterId);
  const workloadTag = tagEquals('kubernetes.node.name', node.name);
  const tagFilterExpression = toBackendQueryModel(andQuery(clusterTag, workloadTag));
  const timeShift = useTimeShiftConfig();
  const type = plugins.kubernetesNode;

  const kpiWidth = 2;

  // TODO: Use for tsx
  // const defaultBigNumberMetricConfig = {
  //   source,
  //   aggregation: 'MEAN' as AggregationType,
  //   tagFilterExpression,
  //   type,
  //   timeShift,
  //   timeConfig,
  //   resultType: 'SINGLE_NUMBER' as ResultType
  // };
  const defaultBigNumberMetricConfig = {
    source,
    aggregation: 'MEAN',
    tagFilterExpression,
    type,
    timeShift,
    timeConfig,
    resultType: 'SINGLE_NUMBER'
  };

  // TODO: Use for tsx
  //  rename to isNodeMetric and change the type maybe
  // const isContainerMetric = {
  //   /* use this configuration on containers of this pod (which can be of type docker, containerd or crio)
  //     type filtering must be disabled and cross series aggregation uses SUM */
  //   type: undefined,
  //   crossSeriesAggregation: 'SUM' as AggregationType
  // };

  const isContainerMetric = {
    /* use this configuration on containers of this pod (which can be of type docker, containerd or crio)
      type filtering must be disabled and cross series aggregation uses SUM */
    type: undefined,
    crossSeriesAggregation: 'SUM'
  };

  const comparisonColors = {
    comparisonDecreaseColor: blue.id,
    comparisonIncreaseColor: blue.id
  };

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
          value={<Capitalize>{node.age ? formatDuration(node.age) : valueMissingPlaceholder}</Capitalize>}
          raw
          borderless
        />
      </KpiGridRow>
      <Row>
        <Col lg={kpiWidth}>
          <BigNumberKpiCard
            title={t('in-kubernetes:dashboards.cpuRequestsAlloc')}
            formatter={percentage.detailed}
            config={{
              metricConfiguration: {
                metric: 'required_cpu_percentage',
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
            title={t('in-kubernetes:dashboards.cpuLimitsAlloc')}
            formatter={percentage.detailed}
            config={{
              metricConfiguration: {
                metric: 'limit_cpu_percentage',
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
            title={t('in-kubernetes:dashboards.memoryRequestsAlloc')}
            formatter={percentage.detailed}
            config={{
              metricConfiguration: {
                metric: 'required_mem_percentage',
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
            title={t('in-kubernetes:dashboards.memoryLimits')}
            formatter={percentage.detailed}
            config={{
              metricConfiguration: {
                metric: 'limit_mem_percentage',
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
            title={t('in-kubernetes:dashboards.podsAlloc')}
            formatter={percentage.detailed}
            config={{
              metricConfiguration: {
                metric: 'alloc_pods_percentage',
                ...defaultBigNumberMetricConfig,
                ...isContainerMetric
              },
              ...comparisonColors
            }}
            raw
          />
        </Col>
      </Row>

      <Row>
        <Col lg={4}>
          <Card title={t('in-kubernetes:dashboards.cpuResources')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: resourceQuotaNumber,
                metrics: ['cpu.total_usage', 'required_cpu', 'limit_cpu', 'cap_cpu'].filter(Boolean),
                labels: [
                  t('in-kubernetes:dashboards.usage'),
                  t('in-kubernetes:dashboards.requests'),
                  t('in-kubernetes:dashboards.limits'),
                  t('in-kubernetes:dashboards.capacity')
                ].filter(Boolean),
                type: 'line',
                colors: [usage, requests, limits, capacity].filter(Boolean)
              }}
              renderPostChartContent={K8DashboardsMarkerLanes}
              minRollup={10000}
            />
          </Card>
        </Col>
        <Col lg={4}>
          <Card title={t('in-kubernetes:dashboards.memoryResources')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: resourceQuotaBytes,
                metrics: ['memory.usage', 'required_mem', 'limit_mem', 'cap_mem'].filter(Boolean),
                labels: [
                  t('in-kubernetes:dashboards.usage'),
                  t('in-kubernetes:dashboards.requests'),
                  t('in-kubernetes:dashboards.limits'),
                  t('in-kubernetes:dashboards.capacity')
                ].filter(Boolean),
                type: 'line',
                colors: [usage, requests, limits, capacity].filter(Boolean)
              }}
              renderPostChartContent={K8DashboardsMarkerLanes}
              minRollup={10000}
            />
          </Card>
        </Col>
        <Col lg={4}>
          <Card title={t('in-kubernetes:dashboards.podsAllocation')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: zeroDecimalPlaces,
                metrics: ['allocatedPods', 'cap_pods'],
                labels: [t('in-kubernetes:dashboards.allocated'), t('in-kubernetes:dashboards.capacity')],
                type: 'line'
              }}
              renderPostChartContent={K8DashboardsMarkerLanes}
            />
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <LogsChartInteractionWrapper
            tagFilterExpression={andQuery(clusterTag, workloadTag)}
            timeConfig={timeConfig}
          />
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
