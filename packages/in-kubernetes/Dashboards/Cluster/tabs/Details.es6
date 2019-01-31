import React, { Fragment } from 'react';

import ComponentStatusTable from 'in-kubernetes/Dashboards/Cluster/tabs/ComponentStatusTable';
import InfraMetricKpiCard from 'in-new-components/KpiCard/InfraMetricKpiCard';
import { percentage } from 'in-services/formatters/number';
import { Row, Col } from 'in-new-components/layout/Grid';

export default function Details({ data: cluster }) {
  const snapshotId = cluster.id;

  return (
    <Fragment>
      <Row>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="CPU Req. Alloc."
            snapshotId={snapshotId}
            metric="requiredCapacityCPURatio"
            formatter={percentage.detailed}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="CPU Limits Alloc."
            snapshotId={snapshotId}
            metric="limitCapacityCPURatio"
            formatter={percentage.detailed}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="Memory Req. Alloc."
            snapshotId={snapshotId}
            metric="requiredCapacityMemoryRatio"
            formatter={percentage.detailed}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="Memory Limits Alloc."
            snapshotId={snapshotId}
            metric="limitCapacityMemoryRatio"
            formatter={percentage.detailed}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="Pods Alloc."
            snapshotId={snapshotId}
            metric="allocatedCapacityPodsRatio"
            formatter={percentage.detailed}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <ComponentStatusTable cluster={cluster} />
        </Col>
      </Row>
    </Fragment>
  );
}
