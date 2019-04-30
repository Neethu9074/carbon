import React from 'react';

import MetricsCassandra from 'in-internal/monitoringUnit/sre/MetricsCassandra';
import SpansCassandra from 'in-internal/monitoringUnit/sre/SpansCassandra';
import { Row, Col } from 'in-new-components/layout/Grid';

export default function Appdata() {
  return (
    <Row>
      <Col xs={6}>
        <MetricsCassandra />
      </Col>
      <Col xs={6}>
        <SpansCassandra />
      </Col>
    </Row>
  );
}
