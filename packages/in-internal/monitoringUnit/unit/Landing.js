import React, { Fragment } from 'react';

import ProcessingComponents from 'in-internal/monitoringUnit/unit/ProcessingComponents';
import SloViolationsChart from 'in-internal/components/SloViolationsChart';
import { Row, Col } from 'in-new-components/layout/Grid';

export default function Landing({ timeConfig, tenant, unit }) {
  return (
    <Fragment>
      <Row>
        <Col lg={12}>
          <SloViolationsChart
            timeConfig={timeConfig}
            query={`entity.label:"${tenant}-${unit}-*"`}
            cardTitle={`SLO Violations for ${tenant}-${unit}`}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <ProcessingComponents timeConfig={timeConfig} tenant={tenant} unit={unit} />
        </Col>
      </Row>
    </Fragment>
  );
}
