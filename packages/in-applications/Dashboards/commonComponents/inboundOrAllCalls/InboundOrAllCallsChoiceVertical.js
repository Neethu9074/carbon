import React from 'react';

import InboundOrAllCallsOptionBox from 'in-applications/Dashboards/commonComponents/inboundOrAllCalls/InboundOrAllCallsOptionBox';
import { boundaryScopes } from 'in-applications/constants';
import { Col, Row } from 'in-new-components/layout/Grid';

export default function InboundOrAllCallsChoiceVertical({ boundaryScope, onBoundaryStateChange }) {
  return (
    <Row>
      <Col lg={12}>
        <InboundOrAllCallsOptionBox
          boundaryScope={boundaryScope}
          onBoundaryStateChange={onBoundaryStateChange}
          scope={boundaryScopes.inbound}
        />
        <InboundOrAllCallsOptionBox
          boundaryScope={boundaryScope}
          onBoundaryStateChange={onBoundaryStateChange}
          scope={boundaryScopes.all}
        />
      </Col>
    </Row>
  );
}
