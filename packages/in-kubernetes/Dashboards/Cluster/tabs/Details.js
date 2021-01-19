/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import ComponentStatusTable from 'in-kubernetes/Dashboards/Cluster/tabs/ComponentStatusTable';
import Debugging from 'in-kubernetes/Dashboards/Cluster/tabs/Debugging';
import { Row, Col } from 'in-new-components/layout/Grid';

export default function Details({ data: cluster }) {
  return (
    <Fragment>
      <Row>
        <Col lg={12}>
          <ComponentStatusTable cluster={cluster} />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <Debugging cluster={cluster} />
        </Col>
      </Row>
    </Fragment>
  );
}
