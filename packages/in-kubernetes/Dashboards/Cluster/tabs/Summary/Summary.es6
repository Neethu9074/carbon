import React, { Fragment } from 'react';

import { zeroDecimalPlaces, bytesTwoDecimalPlaces, twoDecimalPlaces } from 'in-services/formatters/number';
import ComponentStatusTable from 'in-kubernetes/Dashboards/Cluster/tabs/Summary/ComponentStatusTable';
import { Row, Col } from 'in-new-components/layout/Grid';
import Card from 'in-new-components/Card';
import Chart from 'in-components/Chart';

export default function Summary({ timeConfig, data: cluster }) {
  return (
    <Fragment>
      <Row>
        <Col lg={12}>
          <ComponentStatusTable cluster={cluster} />
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <Card title="CPU Resources">
            <Chart
              snapshotId={cluster.id}
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
        <Col lg={6}>
          <Card title="Memory Resources">
            <Chart
              snapshotId={cluster.id}
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
      </Row>
      <Row>
        <Col lg={12}>
          <Card title="Pods">
            <Chart
              snapshotId={cluster.id}
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
      <Row>
        <Col lg={4}>
          <Card title="Top Namespaces">{}</Card>
        </Col>
        <Col lg={4}>
          <Card title="Top Services">{}</Card>
        </Col>
        <Col lg={4}>
          <Card title="Top Deployments">{}</Card>
        </Col>
      </Row>
    </Fragment>
  );
}
