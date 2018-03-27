import React, { Fragment } from 'react';

import { number, millis } from 'in-services/formatters/number';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';

export default function Summary({ data: trace }) {
  return (
    <Fragment>
      <Row>
        <Col lg={3}>
          <KpiCard title="Duration" value={millis.compact(trace.duration)} />
        </Col>
        <Col lg={3}>
          <KpiCard title="Calls" value={number.compact(trace.callCount)} />
        </Col>
        <Col lg={3}>
          <KpiCard title="Spans" value={number.compact(trace.spanCount)} />
        </Col>
        <Col lg={3}>
          <KpiCard title="Errors" value={number.compact(trace.totalErrorCount)} />
        </Col>
      </Row>
    </Fragment>
  );
}
