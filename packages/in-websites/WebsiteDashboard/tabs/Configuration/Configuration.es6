import React, { Fragment } from 'react';

import TrackingScript from 'in-websites/WebsiteDashboard/tabs/Configuration/TrackingScript';
import Rename from 'in-websites/WebsiteDashboard/tabs/Configuration/Rename';
import Remove from 'in-websites/WebsiteDashboard/tabs/Configuration/Remove';
import { Row, Col } from 'in-new-components/layout/Grid';

export default function Configuration(props) {
  return (
    <Fragment>
      <Row>
        <Col lg={6} lgOffset={3}>
          <Rename {...props} />
        </Col>
      </Row>
      <Row>
        <Col lg={6} lgOffset={3}>
          <TrackingScript {...props} />
        </Col>
      </Row>
      <Row>
        <Col lg={6} lgOffset={3}>
          <Remove {...props} />
        </Col>
      </Row>
    </Fragment>
  );
}
