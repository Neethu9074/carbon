/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import AlertTestsViewer from 'in-alerting/smart-alerts/synthetics/details/AlertTestsViewer.js';
import { Row, Col } from 'in-components/layout/Grid';

export default {
  component: AlertTestsViewer
};

export const AlertTestsViewerDefault = () => {
  const emptyAlertChannelIdList = [];
  return (
    <div>
      <Row>
        <Col>
          <AlertTestsViewer alertChannelIds={emptyAlertChannelIdList} />
        </Col>
      </Row>
    </div>
  );
};
