import React from 'react';

import { boundaryScopes } from 'in-applications/alerting/advanced/InboundOutboundCallsSwitch/config';
import InboundOrAllCallsOption from './InboundOrAllCallsOption';
import { Col, Row } from 'in-new-components/layout/Grid';

import locals from './InboundOrAllCallsSwitch.mless';

export default function InboundOutboundCallsSwitch({ form, onChange }) {
  const boundaryScope = form.get('boundaryScope').value;

  return (
    <div className={locals.inboundOutboundCallsSwitchContainer}>
      <Row>
        <Col lg={6}>
          <InboundOrAllCallsOption
            boundaryScope={boundaryScope}
            onBoundaryStateChange={() =>
              onChange(['boundaryScope'], f => f.setValue(boundaryScopes.inbound).setTouched(true))
            }
            scope={boundaryScopes.inbound}
          />
        </Col>
        <Col lg={6}>
          <InboundOrAllCallsOption
            boundaryScope={boundaryScope}
            onBoundaryStateChange={() =>
              onChange(['boundaryScope'], f => f.setValue(boundaryScopes.all).setTouched(true))
            }
            scope={boundaryScopes.all}
          />
        </Col>
      </Row>
    </div>
  );
}
