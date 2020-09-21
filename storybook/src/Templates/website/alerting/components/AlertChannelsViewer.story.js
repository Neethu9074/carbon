import React from 'react';

import AlertChannelsViewer from 'in-new-components/Alerting/components/AlertChannelsViewer';
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
