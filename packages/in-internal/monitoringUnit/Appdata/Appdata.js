/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import AppdataReaderStatistics from 'in-internal/monitoringUnit/Appdata/AppdataReaderStatistics';
import AppdataWriterStatistics from 'in-internal/monitoringUnit/Appdata/AppdataWriterStatistics';
import { Row, Col } from 'in-new-components/layout/Grid';

export default function Appdata() {
  return (
    <Row>
      <Col xs={6}>
        <AppdataWriterStatistics />
      </Col>
      <Col xs={6}>
        <AppdataReaderStatistics />
      </Col>
    </Row>
  );
}
