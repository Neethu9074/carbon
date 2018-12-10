import React, { Fragment } from 'react';

import KeyValueList from 'in-kubernetes/Dashboards/commonComponents/KeyValueList';
import Annotations from 'in-kubernetes/Dashboards/commonComponents/Annotations';
import InfraMetricKpiCard from 'in-new-components/KpiCard/InfraMetricKpiCard';
import Spec from 'in-kubernetes/Dashboards/commonComponents/Spec';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';

export default function Details({ data: pod }) {
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
        <Col lg={12}>
          <KeyValueList title="Labels" icon="lib_kubernetes_label" items={pod.labels} />
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <Spec snapshotId={snapshotId} />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <Annotations snapshotId={snapshotId} />
        </Col>
      </Row>
    </Fragment>
  );
}
