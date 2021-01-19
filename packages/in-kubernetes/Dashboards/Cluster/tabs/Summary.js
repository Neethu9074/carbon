/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';
import theme from 'in-themes';
import { get } from 'lodash';

import { zeroDecimalPlaces, twoDecimalPlaces, bytesTwoDecimalPlaces, percentage } from 'in-services/formatters/number';
import MissingK8sPermissions from 'in-kubernetes/Dashboards/commonComponents/MissingK8sPermissions';
import TopDeploymentsList from 'in-kubernetes/Dashboards/commonComponents/TopDeploymentsList';
import TopNamespacesList from 'in-kubernetes/Dashboards/commonComponents/TopNamespacesList';
import K8DashboardsMarkerLanes from 'in-kubernetes/Dashboards/K8DashboardsMarkerLanes';
import TopNodesList from 'in-kubernetes/Dashboards/commonComponents/TopNodesList';
import InfraMetricKpiCard from 'in-new-components/KpiCard/InfraMetricKpiCard';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { getClusterDashboard } from 'in-kubernetes/navigation/paths';
import { k8sClusterUsageEnabled } from 'in-services/featureFlags';
import { isOpenshift } from 'in-kubernetes/clusterDistributions';
import { Row, Col } from 'in-new-components/layout/Grid';
import Card from 'in-new-components/Card';

const showUsage = k8sClusterUsageEnabled;

export default function Summary({ timeConfig, data: cluster }) {
  const snapshotId = cluster.id;
  const {
    green800: running,
    teal800: capacity,
    orange800: limits,
    lime800: requests,
    lightBlue800: usage,
    orange800: pending,
    lightBlue800: allocated
  } = theme.lib.colors;

  return (
    <Fragment>
      <MissingK8sPermissions cluster={cluster} />

      <Row>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="CPU Requests"
            snapshotId={snapshotId}
            metric="requiredCapacityCPURatio"
            formatter={percentage.detailed}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="CPU Limits Alloc."
            snapshotId={snapshotId}
            metric="limitCapacityCPURatio"
            formatter={percentage.detailed}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="Memory Requests"
            snapshotId={snapshotId}
            metric="requiredCapacityMemoryRatio"
            formatter={percentage.detailed}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="Memory Limits Alloc."
            snapshotId={snapshotId}
            metric="limitCapacityMemoryRatio"
            formatter={percentage.detailed}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="Pods Alloc."
            snapshotId={snapshotId}
            metric="allocatedCapacityPodsRatio"
            formatter={percentage.detailed}
          />
        </Col>
      </Row>

      <Row verticallyStretchColumns>
        <Col lg={4}>
          <Card title="CPU Resources" useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: twoDecimalPlaces,
                metrics: ['requiredCPU', 'limitCPU', 'nodes.capacity_cpu', showUsage && 'cpu.total_usage'].filter(
                  Boolean
                ),
                labels: ['Requests', 'Limits', 'Capacity', showUsage && 'Usage'].filter(Boolean),
                type: 'line',
                colors: [requests, limits, capacity, usage]
              }}
              renderPostChartContent={K8DashboardsMarkerLanes}
            />
          </Card>
        </Col>
        <Col lg={4}>
          <Card title="Memory Resources" useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: bytesTwoDecimalPlaces,
                metrics: ['requiredMemory', 'limitMemory', 'nodes.capacity_mem', showUsage && 'memory.usage'].filter(
                  Boolean
                ),
                labels: ['Requests', 'Limits', 'Capacity', showUsage && 'Usage'].filter(Boolean),
                type: 'line',
                colors: [requests, limits, capacity, usage]
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
                formatter: zeroDecimalPlaces,
                metrics: ['podsRunning', 'podsPending', 'pods.count', 'nodes.capacity_pods'],
                labels: ['Running', 'Pending', 'Allocated', 'Capacity'],
                type: 'line',
                colors: [running, pending, allocated, capacity]
              }}
              renderPostChartContent={K8DashboardsMarkerLanes}
            />
          </Card>
        </Col>
      </Row>

      <Row verticallyStretchColumns>
        <Col lg={4}>
          <TopNodesList
            clusterId={cluster.id}
            timeConfig={timeConfig}
            allItemsHref$={getClusterDashboard(cluster.id, {
              tab: '/nodes'
            })}
          />
        </Col>
        <Col lg={4}>
          <TopNamespacesList
            clusterId={cluster.id}
            timeConfig={timeConfig}
            allItemsHref$={getClusterDashboard(cluster.id, {
              tab: '/namespaces'
            })}
          />
        </Col>
        <Col lg={4}>
          <TopDeploymentsList
            clusterId={cluster.id}
            timeConfig={timeConfig}
            allItemsHrefs$={{
              deployments: getClusterDashboard(cluster.id, {
                tab: '/deployments'
              }),
              deploymentConfigs: getClusterDashboard(cluster.id, {
                tab: '/deploymentconfigs'
              })
            }}
            showDeploymentConfigs={isOpenshift(get(cluster, ['clusterDistribution'], 'kubernetes'))}
          />
        </Col>
      </Row>
    </Fragment>
  );
}
