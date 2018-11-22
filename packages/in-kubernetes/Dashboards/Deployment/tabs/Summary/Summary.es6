import React, { Fragment } from 'react';

import { zeroDecimalPlaces, timeByMillisTwoDecimalPlaces } from 'in-services/formatters/number';
import ConditionsList from 'in-kubernetes/Dashboards/commonComponents/ConditionsList';
import InfraMetricKpiCard from 'in-new-components/KpiCard/InfraMetricKpiCard';
import LabelsList from 'in-kubernetes/Dashboards/commonComponents/LabelsList';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';

const noActivity = 'No activity';
const msFormatter = d => (d < 0 ? noActivity : timeByMillisTwoDecimalPlaces(d));

export default function Summary({ data: deploymentItem }) {
  const deployment = deploymentItem.deployment;

  return (
    <Fragment>
      <Row>
        <Col lg={4}>
          <KpiCard title="Namespace" value={deployment.namespace} raw />
        </Col>
        <Col lg={4}>
          <KpiCard title="Cluster" value={deployment.clusterId} raw />
        </Col>
        <Col lg={4}>
          <InfraMetricKpiCard
            title="Restarts"
            snapshotId={deployment.id}
            metric="restartCount"
            formatter={zeroDecimalPlaces}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={4}>
          <InfraMetricKpiCard
            title="Available Replicas"
            snapshotId={deployment.id}
            metric="availableReplicas"
            formatter={zeroDecimalPlaces}
          />
        </Col>
        <Col lg={4}>
          <InfraMetricKpiCard
            title="Desired Replicas"
            snapshotId={deployment.id}
            metric="desiredReplicas"
            formatter={zeroDecimalPlaces}
          />
        </Col>
        <Col lg={4}>
          <InfraMetricKpiCard
            title="Pending Pods"
            snapshotId={deployment.id}
            metric="phase.Pending.count"
            formatter={zeroDecimalPlaces}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={4}>
          <InfraMetricKpiCard
            title="Unscheduled Pods"
            snapshotId={deployment.id}
            metric="conditions.PodScheduled.False"
            formatter={zeroDecimalPlaces}
          />
        </Col>
        <Col lg={4}>
          <InfraMetricKpiCard
            title="Unready Pods"
            snapshotId={deployment.id}
            metric="conditions.Ready.False"
            formatter={zeroDecimalPlaces}
          />
        </Col>
        <Col lg={4}>
          <InfraMetricKpiCard
            title="Last pending phase duration"
            snapshotId={deployment.id}
            metric="lastDuration"
            formatter={msFormatter}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <ConditionsList conditions={deployment.conditions} />
        </Col>
        <Col lg={12}>
          <LabelsList labels={deployment.labels} />
        </Col>
      </Row>
    </Fragment>
  );
}
