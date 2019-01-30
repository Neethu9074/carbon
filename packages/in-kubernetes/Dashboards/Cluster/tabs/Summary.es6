import React, { Fragment } from 'react';

import { zeroDecimalPlaces, twoDecimalPlaces, bytesTwoDecimalPlaces, percentage } from 'in-services/formatters/number';
import TopDeploymentsList from 'in-kubernetes/Dashboards/commonComponents/TopDeploymentsList';
import TopNamespacesList from 'in-kubernetes/Dashboards/commonComponents/TopNamespacesList';
import TopNodesList from 'in-kubernetes/Dashboards/commonComponents/TopNodesList';
import InfraMetricKpiCard from 'in-new-components/KpiCard/InfraMetricKpiCard';
import { getClusterDashboard } from 'in-kubernetes/navigation/paths';
import Chart from 'in-components/Chart/LegacyChartAdapter';
import { Row, Col } from 'in-new-components/layout/Grid';
import Card from 'in-new-components/Card';

export default function Summary({ timeConfig, data: cluster }) {
  const snapshotId = cluster.id;

  return (
    <Fragment>
      <Row>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="Pods Alloc."
            snapshotId={snapshotId}
            metric="allocatedCapacityPodsRatio"
            formatter={percentage.detailed}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="CPU Req. Alloc."
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
            title="Memory Req. Alloc."
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
      </Row>

      <Row verticallyStretchColumns>
        <Col lg={4}>
          <Card title="CPU Resources" useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: twoDecimalPlaces,
                metrics: ['requiredCPU', 'limitCPU', 'nodes.capacity_cpu'],
                labels: ['CPU Requests', 'CPU Limits', 'CPU Capacity'],
                type: 'line'
              }}
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
                metrics: ['requiredMemory', 'limitMemory', 'nodes.capacity_mem'],
                labels: ['Memory Requests', 'Memory Limits', 'Memory Capacity'],
                type: 'line'
              }}
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
                labels: ['Running Pods', 'Pending Pods', 'Allocated Pods', 'Pods Capacity'],
                type: 'line'
              }}
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
            allItemsHref$={getClusterDashboard(cluster.id, {
              tab: '/deployments'
            })}
          />
        </Col>
      </Row>
    </Fragment>
  );
}
