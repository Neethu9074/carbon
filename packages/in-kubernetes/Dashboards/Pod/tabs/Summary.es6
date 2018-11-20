import React, { Fragment } from 'react';

import ConditionsList from 'in-kubernetes/Dashboards/commonComponents/ConditionsList';
import LabelsList from 'in-kubernetes/Dashboards/commonComponents/LabelsList';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';

export default function Summary({ data: pod }) {
  return (
    <Fragment>
      <Row>
        <Col lg={4}>
          <KpiCard title="Phase" value={pod.phase} splitByMajorAndMinor={false} />
        </Col>
        <Col lg={4}>
          <KpiCard title="Cluster ID" value={pod.clusterId} splitByMajorAndMinor={false} />
        </Col>
        <Col lg={4}>
          <KpiCard title="Namespace" value={pod.namespace} splitByMajorAndMinor={false} />
        </Col>
      </Row>
      <Row>
        <Col lg={4}>
          <KpiCard title="Host IP" value={pod.hostIp} splitByMajorAndMinor={false} />
        </Col>
        <Col lg={4}>
          <KpiCard title="Pod IP" value={pod.podIp} splitByMajorAndMinor={false} />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <ConditionsList conditions={pod.conditions} />
        </Col>
        <Col lg={12}>
          <LabelsList labels={pod.labels} />
        </Col>
      </Row>
    </Fragment>
  );
}
