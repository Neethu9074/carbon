/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard';

export function KpiHeading({ children }) {
  return <div>{children}</div>;
}

export function KpiKeyValue({ label, iconAction, children }) {
  return (
    <Col xs>
      <KpiCard title={label} iconAction={iconAction} value={children} />
    </Col>
  );
}

export function KpiSection({ children }) {
  return <Row withBottomMargin>{children}</Row>;
}
