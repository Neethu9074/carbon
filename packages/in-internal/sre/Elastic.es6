import React from 'react';

import MetaElastic from 'in-internal/sre/MetaElastic';
import TraceElastic from 'in-internal/sre/TraceElastic';
import { Row, Col } from 'in-new-components/layout/Grid';

export default function Appdata() {
  return (
    <Row>
      <Col xs={6}>
        <MetaElastic />
      </Col>
      <Col xs={6}>
        <TraceElastic />
      </Col>
    </Row>
  );
}
