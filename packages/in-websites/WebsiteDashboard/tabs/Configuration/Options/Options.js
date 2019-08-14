import React, { Fragment } from 'react';

import TrackingScript from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/TrackingScript';
import Rename from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/Rename';
import Remove from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/Remove';
import { Row, Col } from 'in-new-components/layout/Grid';

export default function Options(props) {
  // lg and lgOffset are only configurable because of different sizing when JS stack trace translation is enabled.
  // Can be removed once the feature flag is removed.
  return (
    <Fragment>
      <Row>
        <Col lg={props.lg} lgOffset={props.lgOffset}>
          <Rename {...props} />
        </Col>
      </Row>
      <Row>
        <Col lg={props.lg} lgOffset={props.lgOffset}>
          <TrackingScript {...props} />
        </Col>
      </Row>
      <Row>
        <Col lg={props.lg} lgOffset={props.lgOffset}>
          <Remove {...props} />
        </Col>
      </Row>
    </Fragment>
  );
}
