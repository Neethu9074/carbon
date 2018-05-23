import React, { Fragment } from 'react';

import ServerHeatMap from 'in-new-components/HeatMap/ServerHeatMap';
import { Row, Col } from 'in-new-components/layout/Grid';
import Card from 'in-new-components/Card';

export default function CommonPerformanceSection({ applicationId, serviceId, endpointId, timeConfig }) {
  return (
    <Fragment>
      <Row>
        <Col lg={12}>
          <Card title="Latency Heatmap">
            <ServerHeatMap
              applicationId={applicationId}
              serviceId={serviceId}
              endpointId={endpointId}
              timeConfig={timeConfig}
            />
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}
