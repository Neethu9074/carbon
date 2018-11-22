import React, { Fragment } from 'react';

import { zeroDecimalPlaces, twoDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import ConditionsList from 'in-kubernetes/Dashboards/commonComponents/ConditionsList';
import InfraMetricKpiCard from 'in-new-components/KpiCard/InfraMetricKpiCard';
import LabelsList from 'in-kubernetes/Dashboards/commonComponents/LabelsList';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';

export default function Summary({ data: podItem }) {
  const pod = podItem.pod;

  return (
    <Fragment>
      <Row>
        <Col lg={4}>
          <KpiCard title="Phase" value={pod.phase} raw />
        </Col>
        <Col lg={4}>
          <KpiCard title="Cluster ID" value={pod.clusterId} raw />
        </Col>
        <Col lg={4}>
          <KpiCard title="Namespace" value={pod.namespace} raw />
        </Col>
      </Row>
      <Row>
        <Col lg={4}>
          <KpiCard title="Host IP" value={pod.hostIp} raw />
        </Col>
        <Col lg={4}>
          <KpiCard title="Pod IP" value={pod.podIp} raw />
        </Col>
        <Col lg={4}>
          <InfraMetricKpiCard
            title="Restarts"
            snapshotId={pod.id}
            metric="restartCount"
            formatter={zeroDecimalPlaces}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={3}>
          <InfraMetricKpiCard
            title="CPU Requests"
            snapshotId={pod.id}
            metric="cpuRequests"
            formatter={twoDecimalPlaces}
          />
        </Col>
        <Col lg={3}>
          <InfraMetricKpiCard title="CPU Limits" snapshotId={pod.id} metric="cpuLimits" formatter={twoDecimalPlaces} />
        </Col>
        <Col lg={3}>
          <InfraMetricKpiCard
            title="Memory Requests"
            snapshotId={pod.id}
            metric="memoryRequests"
            formatter={bytesTwoDecimalPlaces}
          />
        </Col>
        <Col lg={3}>
          <InfraMetricKpiCard
            title="Memory Limits"
            snapshotId={pod.id}
            metric="memoryLimits"
            formatter={bytesTwoDecimalPlaces}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <ConditionsList conditions={pod.conditions} />
        </Col>
        <Col lg={12}>
          <LabelsList labels={pod.labels} />
        </Col>
      </Row>
    </Fragment>
  );
}
