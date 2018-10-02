import React from 'react';

import { Row, Col } from 'in-new-components/layout/Grid';

export default function NavigatorSplitScreen({ navigator, traceDetail }) {
  return (
    <Row>
      <Col xs={3}>{navigator}</Col>
      <Col xs={9}>{traceDetail}</Col>
    </Row>
  );
}
