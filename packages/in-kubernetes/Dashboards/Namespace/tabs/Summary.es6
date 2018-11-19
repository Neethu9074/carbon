import React, { Fragment } from 'react';

import { formatDateTime } from 'in-services/formatters/date';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';

export default function Summary({ data: namespace }) {
  // const { timeConfig } = props;

  return (
    <Fragment>
      <Row>
        <Col lg={4}>
          <KpiCard title="Status" value={namespace.status} />
        </Col>
        <Col lg={4}>
          <KpiCard title="Creation Time" value={formatDateTime(namespace.creationTime)} />
        </Col>
      </Row>
    </Fragment>
  );
}
