import React, { Fragment } from 'react';

import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';

export default function Details({ data: service }) {
  return (
    <Fragment>
      <Row>
        <Col lg={4}>
          <KpiCard title="Type" value={service.type} />
        </Col>
        <Col lg={4}>
          <KpiCard title="Location" value={service.location} />
        </Col>
        <Col lg={4}>
          <KpiCard title="Created" value={service.created} />
        </Col>
      </Row>
    </Fragment>
  );
}
