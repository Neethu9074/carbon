/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import AlertChannelsViewer from 'in-alerting/components/AlertChannelsViewer';
import { Row, Col } from 'in-new-components/layout/Grid';

export default {
  title: 'Templates|website/alerting/components/AlertChannelsViewer',
  component: AlertChannelsViewer
};

export const AlertChannelsViewerDefault = () => {
  const emptyAlertChannelIdList = [];
  return (
    <div>
      <Row>
        <Col>
          <AlertChannelsViewer alertChannelIds={emptyAlertChannelIdList} />
        </Col>
      </Row>
    </div>
  );
};
