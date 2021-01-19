/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { boundaryScopes } from 'in-applications/alerting/advanced/InboundOutboundCallsSwitch/config';
import InboundOrAllCallsOption from './InboundOrAllCallsOption';
import { Col, Row } from 'in-new-components/layout/Grid';

import locals from './InboundOrAllCallsSwitch.mless';

export default function InboundOutboundCallsSwitch({ form, updateForm }) {
  const boundaryScope = form.get('boundaryScope').value;
  return (
    <div className={locals.inboundOutboundCallsSwitchContainer}>
      <Row>
        <Col lg={6}>
          <InboundOrAllCallsOption
            boundaryScope={boundaryScope}
            onBoundaryStateChange={() => updateBoundaryScope(boundaryScopes.inbound)}
            scope={boundaryScopes.inbound}
          />
        </Col>
        <Col lg={6}>
          <InboundOrAllCallsOption
            boundaryScope={boundaryScope}
            onBoundaryStateChange={() => updateBoundaryScope(boundaryScopes.all)}
            scope={boundaryScopes.all}
          />
        </Col>
      </Row>
    </div>
  );

  function updateBoundaryScope(boundaryScope) {
    updateForm(
      form
        .updateIn(['boundaryScope'], f => f.setValue(boundaryScope).setTouched(true))
        .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
    );
  }
}
