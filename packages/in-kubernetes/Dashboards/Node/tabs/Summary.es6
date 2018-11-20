import React, { Fragment } from 'react';

import ConditionsTable from 'in-kubernetes/Dashboards/commonComponents/ConditionsTable';
import LabelsTable from 'in-kubernetes/Dashboards/commonComponents/LabelsTable';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';

export default function Summary({ data: node }) {
  return (
    <Fragment>
      <Row>
        <Col lg={6}>
          <KpiCard title="Machine ID" value={node.machineId} />
        </Col>
        <Col lg={6}>
          <KpiCard title="Cluster" value={node.clusterId} />
        </Col>
        <Col lg={6}>
          <KpiCard title="Hostname" value={node.hostname} />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <ConditionsTable conditions={node.conditions} />
        </Col>
        <Col lg={12}>
          <LabelsTable labels={node.labels} />
        </Col>
      </Row>
    </Fragment>
  );
}
