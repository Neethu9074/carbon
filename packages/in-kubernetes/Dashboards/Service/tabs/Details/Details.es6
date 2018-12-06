import React, { Fragment } from 'react';

import SelectorsList from 'in-kubernetes/Dashboards/commonComponents/SelectorsList';
import KeyValueList from 'in-kubernetes/Dashboards/commonComponents/KeyValueList';
import PortsList from 'in-kubernetes/Dashboards/commonComponents/PortsList';
import { formatDuration } from 'in-services/formatters/date';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';

export default function Details({ data: service }) {
  return (
    <Fragment>
      <Row>
        <Col lg={4}>
          <KpiCard title="Type" value={service.type} raw />
        </Col>
        <Col lg={4}>
          <KpiCard title="Location" value={service.location} raw />
        </Col>
        <Col lg={4}>
          <KpiCard title="Age" value={formatDuration(service.age)} raw />
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <SelectorsList selectors={service.selectors} />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <KeyValueList title="Labels" icon="lib_kubernetes_label" items={service.labels} />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <KeyValueList title="Annotations" icon="lib_kubernetes_label" items={service.annotations} />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <PortsList ports={service.ports} />
        </Col>
      </Row>
    </Fragment>
  );
}
