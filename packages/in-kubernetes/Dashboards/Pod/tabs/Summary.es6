import React, { Fragment } from 'react';

import { zeroDecimalPlaces, twoDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import InfraMetricKpiCard from 'in-new-components/KpiCard/InfraMetricKpiCard';
import PodStatus from 'in-kubernetes/Dashboards/commonComponents/PodStatus';
import Containers from 'in-kubernetes/Dashboards/Pod/tabs/Containers';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';

export default function Summary({ timeConfig, data: pod }) {
  const snapshotId = pod.id;

  return (
    <Fragment>
      <Row>
        <Col lg={4}>
          <KpiCard title="Phase" value={<PodStatus status={pod.phase} />} raw />
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
        <Col lg={3}>
          <InfraMetricKpiCard
            title="CPU Requests"
            snapshotId={snapshotId}
            metric="cpuRequests"
            formatter={twoDecimalPlaces}
          />
        </Col>
        <Col lg={3}>
          <InfraMetricKpiCard
            title="CPU Limits"
            snapshotId={snapshotId}
            metric="cpuLimits"
            formatter={twoDecimalPlaces}
          />
        </Col>
        <Col lg={3}>
          <InfraMetricKpiCard
            title="Memory Requests"
            snapshotId={snapshotId}
            metric="memoryRequests"
            formatter={bytesTwoDecimalPlaces}
          />
        </Col>
        <Col lg={3}>
          <InfraMetricKpiCard
            title="Memory Limits"
            snapshotId={snapshotId}
            metric="memoryLimits"
            formatter={bytesTwoDecimalPlaces}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <Containers timeConfig={timeConfig} podId={pod.id} />
        </Col>
      </Row>
    </Fragment>
  );
}
