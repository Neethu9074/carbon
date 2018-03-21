import React, { Fragment } from 'react';

import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import { number } from 'in-services/formatters/number';

export default function Summary({ data: trace }) {
  return (
    <Fragment>
      <Row>
        <Col lg={4}>
          <KpiCard title="Duration" value={number.compact(trace.rootSpan.duration)} />
        </Col>
        <Col lg={4}>
          <KpiCard title="Duration" value="TODO" />
        </Col>
        <Col lg={4}>
          <KpiCard title="Errors" value={number.compact(trace.totalErrorCount)} />
        </Col>
      </Row>
    </Fragment>
  );
}
