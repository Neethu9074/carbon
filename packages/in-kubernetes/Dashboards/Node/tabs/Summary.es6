import React, { Fragment } from 'react';

import ConditionsList from 'in-kubernetes/Dashboards/commonComponents/ConditionsList';
import InfraMetricKpiCard from 'in-new-components/KpiCard/InfraMetricKpiCard';
import LabelsList from 'in-kubernetes/Dashboards/commonComponents/LabelsList';
import { percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';

export default function Summary({ data: node }) {
  return (
    <Fragment>
      <Row>
        <Col lg={4}>
          <KpiCard title="Machine ID" value={node.machineId} raw />
        </Col>
        <Col lg={4}>
          <KpiCard title="Cluster" value={node.clusterId} raw />
        </Col>
        <Col lg={4}>
          <KpiCard title="Hostname" value={node.hostname} raw />
        </Col>
      </Row>
      <Row>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="CPU Requests Alloc."
            snapshotId={node.id}
            metric="required_cpu_percentage"
            formatter={percentageTwoDecimalPlaces}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="CPU Limits Alloc."
            snapshotId={node.id}
            metric="limit_cpu_percentage"
            formatter={percentageTwoDecimalPlaces}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="Memory Requests Alloc."
            snapshotId={node.id}
            metric="required_mem_percentage"
            formatter={percentageTwoDecimalPlaces}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="Memory Limits Alloc."
            snapshotId={node.id}
            metric="limit_mem_percentage"
            formatter={percentageTwoDecimalPlaces}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="Pods Alloc."
            snapshotId={node.id}
            metric="alloc_pods_percentage"
            formatter={percentageTwoDecimalPlaces}
          />
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
