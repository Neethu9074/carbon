import React, { Fragment } from 'react';

import ConditionsList from 'in-kubernetes/Dashboards/commonComponents/ConditionsList';
import LabelsList from 'in-kubernetes/Dashboards/commonComponents/LabelsList';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';

export default function Summary({ data: deployment }) {
  return (
    <Fragment>
      <Row>
        <Col lg={6}>
          <KpiCard title="Namespace" value={deployment.namespace} raw />
        </Col>
        <Col lg={6}>
          <KpiCard title="Cluster" value={deployment.clusterId} raw />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <ConditionsList conditions={deployment.conditions} />
        </Col>
        <Col lg={12}>
          <LabelsList labels={deployment.labels} />
        </Col>
      </Row>
    </Fragment>
  );
}
