import React, { Fragment } from 'react';

import ConditionsList from 'in-kubernetes/Dashboards/commonComponents/ConditionsList';
import LabelsList from 'in-kubernetes/Dashboards/commonComponents/LabelsList';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';

export default function Summary({ data: node }) {
  return (
    <Fragment>
      <Row>
        <Col lg={4}>
          <KpiCard title="Machine ID" value={node.machineId} splitByMajorAndMinor={false} />
        </Col>
        <Col lg={4}>
          <KpiCard title="Cluster" value={node.clusterId} splitByMajorAndMinor={false} />
        </Col>
        <Col lg={4}>
          <KpiCard title="Hostname" value={node.hostname} splitByMajorAndMinor={false} />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <ConditionsList conditions={node.conditions} />
        </Col>
        <Col lg={12}>
          <LabelsList labels={node.labels} />
        </Col>
      </Row>
    </Fragment>
  );
}
