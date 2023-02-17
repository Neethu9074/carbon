/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

// @ts-expect-error
import MissingK8sPermissions from 'in-kubernetes/Dashboards/commonComponents/MissingK8sPermissions';
import DetailsControlPlane from 'in-kubernetes/Dashboards/Cluster/tabs/DetailsControlPlane';
import { Row, Col } from 'in-components/layout/Grid';

export default function ControlPlane({ data: cluster, timeConfig }: any) {
  return (
    <Fragment>
      <MissingK8sPermissions resourceSnapshotId={cluster.id} timeConfig={timeConfig} />
      <Row>
        <Col lg={12}>
          <DetailsControlPlane cluster={cluster} timeConfig={timeConfig} />
        </Col>
      </Row>

      <Row>{/* ETCD Cluster Info */}</Row>
    </Fragment>
  );
}
