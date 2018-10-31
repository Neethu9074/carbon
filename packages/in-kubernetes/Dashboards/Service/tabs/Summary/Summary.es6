import React, { Fragment } from 'react';

import ResultAwareKpiCard from 'in-new-components/KpiCard/ResultAwareKpiCard';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';

export default function Summary({ data }) {
  const result = {
    progress: { loading: false },
    errors: [],
    data
  };

  return (
    <Fragment>
      <Row>
        <Col lg={4}>
          <ResultAwareKpiCard
            title="Type"
            result={result}
            renderKpiCard={() => <KpiCard title="Type" value={data.type} />}
          />
        </Col>
        <Col lg={4}>
          <ResultAwareKpiCard
            title="Location"
            result={result}
            renderKpiCard={() => <KpiCard title="Location" value={data.location} />}
          />
        </Col>
        <Col lg={4}>
          <ResultAwareKpiCard
            title="Age"
            result={result}
            renderKpiCard={() => <KpiCard title="Age" value={data.age} />}
          />
        </Col>
      </Row>
    </Fragment>
  );
}
