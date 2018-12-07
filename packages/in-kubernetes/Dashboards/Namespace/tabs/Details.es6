import React, { Fragment } from 'react';

import KeyValueList from 'in-kubernetes/Dashboards/commonComponents/KeyValueList';
import Annotations from 'in-kubernetes/Dashboards/commonComponents/Annotations';
import DateTimeKpiCard from 'in-new-components/KpiCard/DateTimeKpiCard';
import Spec from 'in-kubernetes/Dashboards/commonComponents/Spec';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';

export default function Details({ data: namespace }) {
  return (
    <Fragment>
      <Row>
        <Col lg={6}>
          <KpiCard title="Status" value={namespace.status} raw />
        </Col>
        <Col lg={6}>
          <DateTimeKpiCard title="Creation Time" time={namespace.created} raw />
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <KeyValueList title="Labels" icon="lib_kubernetes_label" items={namespace.labels} />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <Spec snapshotId={namespace.id} />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <Annotations snapshotId={namespace.id} />
        </Col>
      </Row>
    </Fragment>
  );
}
