/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Row, Col } from 'in-components/layout/Grid';
import DataUsage from 'in-amp/components/DataUsage';

import locals from 'in-amp/pages/AccountAndBilling/AccountAndBilling.mless';

export default function DataGranularity() {
  return (
    <Row className={locals.bottomMargin}>
      <Col xs={12}>
        <DataUsage />
      </Col>
    </Row>
  );
}
