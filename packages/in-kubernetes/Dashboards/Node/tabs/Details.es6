import React, { Fragment } from 'react';

import KeyValueList from 'in-kubernetes/Dashboards/commonComponents/KeyValueList';
import Annotations from 'in-kubernetes/Dashboards/commonComponents/Annotations';
import Spec from 'in-kubernetes/Dashboards/commonComponents/Spec';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';

export default function Details({ data: node }) {
  const snapshotId = node.id;

  return (
    <Fragment>
      <Row>
        <Col lg={4}>
          <KpiCard title="Machine ID" value={node.machineId} raw />
        </Col>
        <Col lg={4}>
          <KpiCard title="Cluster" value={node.clusterId} raw />
        </Col>
        <Col lg={4}>
          <KpiCard title="Hostname" value={node.hostname} raw />
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <KeyValueList title="Labels" icon="lib_kubernetes_label" items={node.labels} />
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
