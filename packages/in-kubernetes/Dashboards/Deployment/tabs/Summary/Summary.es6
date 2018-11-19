import React, { Fragment } from 'react';

import ConditionsTable from 'in-kubernetes/Dashboards/Deployment/tabs/Summary/ConditionsTable';
import LabelsTable from 'in-kubernetes/Dashboards/Deployment/tabs/Summary/LabelsTable';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';

export default function Summary({ data: deployment }) {
  return (
    <Fragment>
      <Row>
        <Col lg={6}>
          <KpiCard title="Namespace" value={deployment.namespace} />
        </Col>
        <Col lg={6}>
          <KpiCard title="Cluster" value={deployment.clusterId} />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <ConditionsTable deployment={deployment} />
        </Col>
        <Col lg={12}>
          <LabelsTable deployment={deployment} />
        </Col>
      </Row>
    </Fragment>
  );
}
