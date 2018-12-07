import React, { Fragment } from 'react';

import ComponentStatusTable from 'in-kubernetes/Dashboards/Cluster/tabs/ComponentStatusTable';
import KeyValueList from 'in-kubernetes/Dashboards/commonComponents/KeyValueList';
import Annotations from 'in-kubernetes/Dashboards/commonComponents/Annotations';
import InfraMetricKpiCard from 'in-new-components/KpiCard/InfraMetricKpiCard';
import Spec from 'in-kubernetes/Dashboards/commonComponents/Spec';
import { percentage } from 'in-services/formatters/number';
import { Row, Col } from 'in-new-components/layout/Grid';

export default function Details({ data: cluster }) {
  const snapshotId = cluster.id;

  return (
    <Fragment>
      <Row>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="Pods Alloc."
            snapshotId={snapshotId}
            metric="allocatedCapacityPodsRatio"
            formatter={percentage.detailed}
          />
        </Col>
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
      </Row>

      <Row>
        <Col lg={6}>
          <ComponentStatusTable cluster={cluster} />
        </Col>
        <Col lg={6}>
          <KeyValueList title="Labels" icon="lib_kubernetes_label" items={cluster.labels} />
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <Spec snapshotId={cluster.id} />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <Annotations snapshotId={cluster.id} />
        </Col>
      </Row>
    </Fragment>
  );
}
