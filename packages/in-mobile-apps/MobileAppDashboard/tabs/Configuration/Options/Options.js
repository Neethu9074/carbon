/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import ConfigurationGuidance from 'in-mobile-apps/MobileAppDashboard/tabs/Configuration/Options/ConfigurationGuidance';
import Rename from 'in-mobile-apps/MobileAppDashboard/tabs/Configuration/Options/Rename';
import Remove from 'in-mobile-apps/MobileAppDashboard/tabs/Configuration/Options/Remove';
import { Row, Col } from 'in-components/layout/Grid';

export default function Options(props) {
  return (
    <Fragment>
      <Row>
        <Col lg={7} lgOffset={1}>
          <Rename {...props} />
        </Col>
      </Row>
      <Row>
        <Col lg={7} lgOffset={1}>
          <ConfigurationGuidance {...props} />
        </Col>
      </Row>
      <Row>
        <Col lg={7} lgOffset={1}>
          <Remove {...props} />
        </Col>
      </Row>
    </Fragment>
  );
}
