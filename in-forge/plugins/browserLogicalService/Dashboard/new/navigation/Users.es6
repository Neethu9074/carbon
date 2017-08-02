import React from 'react';

import DashboardTile from 'in-components/Dashboard/components/DashboardTile';
import { Row, Col } from 'in-components/Grid/Grid';

export default function Users({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <Row>
        <Col cols={6}>
          <DashboardTile>
            {snapshotId}
          </DashboardTile>
        </Col>
        <Col cols={6}>
          <DashboardTile>
            {timeframe.windowSize}
          </DashboardTile>
        </Col>
      </Row>
      <Row>
        <Col cols={12}>
          <DashboardTile>
            {timeframe.to}
          </DashboardTile>
        </Col>
      </Row>
    </div>
  );
}
