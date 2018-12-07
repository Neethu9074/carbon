import React from 'react';

import MetricsCassandra from 'in-internal/sre/MetricsCassandra';
import SpansCassandra from 'in-internal/sre/SpansCassandra';
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
