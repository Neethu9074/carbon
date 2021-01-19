/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard';

export function KpiHeading({ children }) {
  return <div>{children}</div>;
}

export function KpiKeyValue({ label, children }) {
  return (
    <Col xs>
      <KpiCard title={label} value={children} />
    </Col>
  );
}

export function KpiSection({ children }) {
  return <Row withBottomMargin>{children}</Row>;
}
