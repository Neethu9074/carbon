import React, { Fragment } from 'react';

import { zeroDecimalPlaces, twoDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import KeyValueList from 'in-kubernetes/Dashboards/commonComponents/KeyValueList';
import InfraMetricKpiCard from 'in-new-components/KpiCard/InfraMetricKpiCard';
import Containers from 'in-kubernetes/Dashboards/Pod/tabs/Containers';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import Card from 'in-new-components/Card';
import Chart from 'in-components/Chart';

export default function Summary({ timeConfig, data: pod }) {
  const snapshotId = pod.id;

  return (
    <Fragment>
      <Row>
        <Col lg={4}>
          <KpiCard title="Phase" value={pod.phase} raw />
        </Col>
        <Col lg={4}>
          <InfraMetricKpiCard
            title="Restarts"
            snapshotId={snapshotId}
            metric="restartCount"
            formatter={zeroDecimalPlaces}
          />
        </Col>
        <Col lg={4}>
          <KpiCard title="Cluster ID" value={pod.clusterId} raw />
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <KpiCard title="Host IP" value={pod.hostIp} raw />
        </Col>
        <Col lg={6}>
          <KpiCard title="Pod IP" value={pod.podIp} raw />
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <Card title="CPU">
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: twoDecimalPlaces,
                metrics: ['cpuRequests', 'cpuLimits'],
                labels: ['CPU Requests', 'CPU Limits'],
                type: 'line'
              }}
            />
          </Card>
        </Col>
        <Col lg={6}>
          <Card title="Memory">
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: bytesTwoDecimalPlaces,
                metrics: ['memoryRequests', 'memoryLimits'],
                labels: ['Memory Requests', 'Memory Limits'],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <Containers timeConfig={timeConfig} podId={pod.id} />
        </Col>
        <Col lg={6}>
          <KeyValueList title="Labels" icon="lib_kubernetes_label" items={pod.labels} />
        </Col>
      </Row>
    </Fragment>
  );
}
