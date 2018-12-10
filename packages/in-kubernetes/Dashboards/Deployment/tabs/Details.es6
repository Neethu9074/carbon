import React, { Fragment } from 'react';

import MetricBasedTwoValueBar from 'in-kubernetes/Dashboards/commonComponents/MetricBasedTwoValueBar';
import KeyValueList from 'in-kubernetes/Dashboards/commonComponents/KeyValueList';
import Annotations from 'in-kubernetes/Dashboards/commonComponents/Annotations';
import Spec from 'in-kubernetes/Dashboards/commonComponents/Spec';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';

export default function Details({ data: deployment }) {
  const snapshotId = deployment.id;

  return (
    <Fragment>
      <Row>
        <Col lg={4}>
          <KpiCard title="Namespace" value={deployment.namespace} raw />
        </Col>
        <Col lg={4}>
          <KpiCard title="Cluster" value={deployment.clusterId} raw />
        </Col>
        <Col lg={4}>
          <KpiCard
            title="Replicas"
            renderValue={() => (
              <MetricBasedTwoValueBar
                snapshotId={snapshotId}
                metrics={['availableReplicas', 'desiredReplicas']}
                labels={['Available', 'Desired']}
              />
            )}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <KeyValueList title="Labels" icon="lib_kubernetes_label" items={deployment.labels} />
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
