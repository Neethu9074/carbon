/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

//@ts-expect-error - Cannot find module
import DataIngestTable from 'in-amp/components/DataIngestTable';
import { Row, Col } from 'in-components/layout/Grid';

import locals from 'in-amp/pages/AccountAndBilling/AccountAndBilling.mless';

export default function ConsumptionOverview() {
  return (
    <Row className={locals.bottomMargin}>
      <Col xs={12}>
        <DataIngestTable />
      </Col>
    </Row>
  );
}
