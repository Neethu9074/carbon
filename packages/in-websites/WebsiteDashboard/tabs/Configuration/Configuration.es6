import React, { Fragment } from 'react';

import TrackingScript from 'in-websites/WebsiteDashboard/tabs/Configuration/TrackingScript';
import Rename from 'in-websites/WebsiteDashboard/tabs/Configuration/Rename';
import { Row, Col } from 'in-new-components/layout/Grid';

export default function Configuration(props) {
  return (
    <Fragment>
      <Row>
        <Col lg={6}>
          <Rename {...props} />
        </Col>

        <Col lg={6}>
          <TrackingScript {...props} />
        </Col>
      </Row>
    </Fragment>
  );
}
