import React from 'react';

import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard';

import locals from './KpiSection.mless';

export function KpiHeading({ children }) {
  return <div className={locals.kpiHeading}>{children}</div>;
}

export function KpiKeyValue({ label, children }) {
  return (
    <Col xs className={locals.keyValue}>
      <KpiCard title={label} value={children} />
    </Col>
  );
}

export function KpiSection({ children }) {
  return <Row withBottomMargin>{children}</Row>;
}
