import React, { Fragment } from 'react';

import Annotations from 'in-kubernetes/Dashboards/Service/tabs/Specification/Annotations';
import Selector from 'in-kubernetes/Dashboards/Service/tabs/Specification/Selector';
import Labels from 'in-kubernetes/Dashboards/Service/tabs/Specification/Labels';
import Status from 'in-kubernetes/Dashboards/Service/tabs/Specification/Status';
import Spec from 'in-kubernetes/Dashboards/Service/tabs/Specification/Spec';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';

export default function Specification({ data: service }) {
  return (
    <Fragment>
      <Row>
        <Col lg={4}>
          <KpiCard title="Type" value={service.type} />
        </Col>
        <Col lg={4}>
          <KpiCard title="Location" value={service.serviceLocation} />
        </Col>
        <Col lg={4}>
          <KpiCard title="Created" value={service.created} />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <Selector service={service} />
        </Col>
        <Col lg={12}>
          <Labels service={service} />
        </Col>
        <Col lg={12}>
          <Annotations service={service} />
        </Col>
        <Col lg={12}>
          <Spec service={service} />
        </Col>
        <Col lg={12}>
          <Status service={service} />
        </Col>
      </Row>
    </Fragment>
  );
}
