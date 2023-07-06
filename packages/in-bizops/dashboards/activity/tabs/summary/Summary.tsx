/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import InfrastructureIssuesAndChanges from 'in-bizops/dashboards/activity/tabs/summary/components/InfrastructureIssuesAndChanges';
import Duration from 'in-bizops/dashboards/activity/tabs/summary/components/Duration';
import Count from 'in-bizops/dashboards/activity/tabs/summary/components/Count';
import { Col, Row } from 'in-components/layout/Grid';

export default function Summary() {
  return (
    <Fragment>
      <Row>
        <Col xs>
          <Count />
        </Col>
        <Col xs>
          <Duration />
        </Col>
        <Col xs>
          <InfrastructureIssuesAndChanges />
        </Col>
      </Row>
    </Fragment>
  );
}
