import React, { Fragment } from 'react';

import LatencyDistributionHistogram from 'in-applications/Dashboards/commonComponents/LatencyDistributionHistogram';
import { Row, Col } from 'in-new-components/layout/Grid';

export default function CommonLatencySections({ applicationId, serviceId, endpointId, timeConfig }) {
  return (
    <Fragment>
      <Row>
        <Col lg={12}>
          <LatencyDistributionHistogram
            cardTitle="Latency Distribution"
            applicationId={applicationId}
            serviceId={serviceId}
            endpointId={endpointId}
            timeConfig={timeConfig}
          />
        </Col>
      </Row>
    </Fragment>
  );
}
