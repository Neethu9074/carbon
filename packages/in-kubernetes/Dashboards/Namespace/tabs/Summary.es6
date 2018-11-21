import React, { Fragment } from 'react';

import InfraMetricKpiCard from 'in-new-components/KpiCard/InfraMetricKpiCard';
import { percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import { formatDateTime } from 'in-services/formatters/date';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';

export default function Summary({ data: namespace }) {
  return (
    <Fragment>
      <Row>
        <Col lg={4}>
          <KpiCard title="Status" value={namespace.status} raw />
        </Col>
        <Col lg={4}>
          <KpiCard title="Creation Time" value={formatDateTime(namespace.creationTime)} raw />
        </Col>
      </Row>
      <Row>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="CPU Requests Alloc."
            snapshotId={namespace.id}
            metric="required_cpu_percentage"
            formatter={percentageTwoDecimalPlaces}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="CPU Limits Alloc."
            snapshotId={namespace.id}
            metric="limit_cpu_percentage"
            formatter={percentageTwoDecimalPlaces}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="Memory Requests Alloc."
            snapshotId={namespace.id}
            metric="required_mem_percentage"
            formatter={percentageTwoDecimalPlaces}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="Memory Limits Alloc."
            snapshotId={namespace.id}
            metric="limit_mem_percentage"
            formatter={percentageTwoDecimalPlaces}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="Pods Alloc."
            snapshotId={namespace.id}
            metric="used_pods_percentage"
            formatter={percentageTwoDecimalPlaces}
          />
        </Col>
      </Row>
    </Fragment>
  );
}
