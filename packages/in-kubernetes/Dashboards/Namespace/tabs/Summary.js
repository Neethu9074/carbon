/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';
import theme from 'in-themes';
import { get } from 'lodash';

import {
  resourceQuotaPercentage,
  resourceQuotaNumber,
  resourceQuotaBytes,
  resourceQuotaZeroDecimalPlaces
} from 'in-kubernetes/formatters';
import MissingK8sPermissions from 'in-kubernetes/Dashboards/commonComponents/MissingK8sPermissions';
import TopDeploymentsList from 'in-kubernetes/Dashboards/commonComponents/TopDeploymentsList';
import MetricFilterChart from 'in-kubernetes/Dashboards/commonComponents/MetricFilterChart';
import K8DashboardsMarkerLanes from 'in-kubernetes/Dashboards/K8DashboardsMarkerLanes';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import TopPodsList from 'in-kubernetes/Dashboards/commonComponents/TopPodsList';
import InfraMetricKpiCard from 'in-new-components/KpiCard/InfraMetricKpiCard';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { getNamespaceDashboard } from 'in-kubernetes/navigation/paths';
import KpiGridRow from 'in-new-components/KpiGridRow/KpiGridRow';
import { isOpenshift } from 'in-kubernetes/clusterDistributions';
import { formatDuration } from 'in-services/formatters/date';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import Card from 'in-new-components/Card';

const resourceQuotaSet = v => v !== -1;

export default function Summary({ timeConfig, data: namespace }) {
  const snapshotId = namespace.id;
  const {
    indigo800: hardLimits,
    purple800: hardRequests,
    orange800: limits,
    lime800: requests,
    slushGreen800: pods,
    lightBlue800: usage
  } = theme.lib.colors;

  return (
    <Fragment>
      <MissingK8sPermissions resourceSnapshotId={namespace.id} timeConfig={timeConfig} />

      <KpiGridRow sizes={[6, 6]}>
        <KpiCard title="Status" value={namespace.status} raw borderless />
        <KpiCard
          title="Age"
          value={namespace.age ? formatDuration(namespace.age) : valueMissingPlaceholder}
          raw
          borderless
        />
      </KpiGridRow>

      <Row>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="CPU Requests"
            snapshotId={snapshotId}
            metric="required_cpu_percentage"
            formatter={resourceQuotaPercentage}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="CPU Limits Alloc."
            snapshotId={snapshotId}
            metric="limit_cpu_percentage"
            formatter={resourceQuotaPercentage}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="Memory Requests"
            snapshotId={snapshotId}
            metric="required_mem_percentage"
            formatter={resourceQuotaPercentage}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="Memory Limits Alloc."
            snapshotId={snapshotId}
            metric="limit_mem_percentage"
            formatter={resourceQuotaPercentage}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="Pods Alloc."
            snapshotId={snapshotId}
            metric="used_pods_percentage"
            formatter={resourceQuotaPercentage}
          />
        </Col>
      </Row>

      <Row verticallyStretchColumns>
        <Col lg={4}>
          <Card title="CPU Resources" useMaxAvailableHeight>
            <MetricFilterChart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              filterMetrics={['cap_requests_cpu', 'cap_limits_cpu']}
              filter={resourceQuotaSet}
              filterReasons={['CPU request', 'CPU limit'].map(r => `There are no ${r} quotas in this namespace`)}
              chartComponent={Chart}
              y1={{
                formatter: resourceQuotaNumber,
                metrics: [`cap_requests_cpu`, `cpuRequests`, `cap_limits_cpu`, `cpuLimits`, 'cpu.total_usage'].filter(
                  Boolean
                ),
                labels: ['Hard Requests', 'Used Requests', 'Hard Limits', 'Used Limits', 'Usage'].filter(Boolean),
                type: 'line',
                min: 0,
                colors: [hardRequests, requests, hardLimits, limits, usage]
              }}
              renderPostChartContent={K8DashboardsMarkerLanes}
            />
          </Card>
        </Col>
        <Col lg={4}>
          <Card title="Memory Resources" useMaxAvailableHeight>
            <MetricFilterChart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              filterMetrics={['cap_requests_memory', 'cap_limits_memory']}
              filter={resourceQuotaSet}
              filterReasons={['memory request', 'memory limit'].map(r => `There are no ${r} quotas in this namespace`)}
              chartComponent={Chart}
              y1={{
                formatter: resourceQuotaBytes,
                metrics: [
                  'cap_requests_memory',
                  'memoryRequests',
                  'cap_limits_memory',
                  'memoryLimits',
                  'memory.usage'
                ].filter(Boolean),
                labels: ['Hard Requests', 'Used Requests', 'Hard Limits ', 'Used Limits', 'Usage'].filter(Boolean),
                type: 'line',
                min: 0,
                colors: [hardRequests, requests, hardLimits, limits, usage]
              }}
              renderPostChartContent={K8DashboardsMarkerLanes}
            />
          </Card>
        </Col>
        <Col lg={4}>
          <Card title="Pods" useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: resourceQuotaZeroDecimalPlaces,
                metrics: ['pods.count', 'cap_pods'],
                labels: ['Used', 'Hard'],
                type: 'line',
                min: 0,
                colors: [pods, hardLimits]
              }}
              renderPostChartContent={K8DashboardsMarkerLanes}
            />
          </Card>
        </Col>
      </Row>

      <Row verticallyStretchColumns>
        <Col lg={6}>
          <TopDeploymentsList
            namespaceId={namespace.id}
            timeConfig={timeConfig}
            allItemsHrefs$={{
              deployments: getNamespaceDashboard(namespace.id, {
                tab: '/deployments'
              }),
              deploymentConfigs: getNamespaceDashboard(namespace.id, {
                tab: '/deploymentconfigs'
              })
            }}
            showDeploymentConfigs={isOpenshift(get(namespace, ['clusterDistribution'], 'kubernetes'))}
          />
        </Col>
        <Col lg={6}>
          <TopPodsList
            namespaceId={namespace.id}
            timeConfig={timeConfig}
            allItemsHref$={getNamespaceDashboard(namespace.id, {
              tab: '/pods'
            })}
          />
        </Col>
      </Row>
    </Fragment>
  );
}
