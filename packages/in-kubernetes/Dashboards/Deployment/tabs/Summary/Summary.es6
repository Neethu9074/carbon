import React, { Fragment } from 'react';

import {
  zeroDecimalPlaces,
  twoDecimalPlaces,
  bytesTwoDecimalPlaces,
  timeByMillisTwoDecimalPlaces
} from 'in-services/formatters/number';
import MetricBasedTwoValueBar from 'in-kubernetes/Dashboards/commonComponents/MetricBasedTwoValueBar';
import ConditionsList from 'in-kubernetes/Dashboards/commonComponents/ConditionsList';
import InfraMetricKpiCard from 'in-new-components/KpiCard/InfraMetricKpiCard';
import LabelsList from 'in-kubernetes/Dashboards/commonComponents/LabelsList';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import Card from 'in-new-components/Card';
import Chart from 'in-components/Chart';

const noActivity = 'No activity';
const msFormatter = d => (d < 0 ? noActivity : timeByMillisTwoDecimalPlaces(d));

export default function Summary({ timeConfig, data: deploymentItem }) {
  const deployment = deploymentItem.deployment;
  const snapshotId = deployment.id;

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
          <KpiCard
            title="Replicas"
            renderValue={() => (
              <MetricBasedTwoValueBar
                snapshotId={snapshotId}
                metrics={['availableReplicas', 'desiredReplicas']}
                labels={['Available', 'Desired']}
              />
            )}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={4}>
          <InfraMetricKpiCard
            title="Unscheduled Pods"
            snapshotId={snapshotId}
            metric="conditions.PodScheduled.False"
            formatter={zeroDecimalPlaces}
          />
        </Col>
        <Col lg={4}>
          <InfraMetricKpiCard
            title="Unready Pods"
            snapshotId={snapshotId}
            metric="conditions.Ready.False"
            formatter={zeroDecimalPlaces}
          />
        </Col>
        <Col lg={4}>
          <InfraMetricKpiCard
            title="Pending Pods"
            snapshotId={snapshotId}
            metric="phase.Pending.count"
            formatter={zeroDecimalPlaces}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={4}>
          <InfraMetricKpiCard
            title="Restarts"
            snapshotId={snapshotId}
            metric="restartCount"
            formatter={zeroDecimalPlaces}
          />
        </Col>
        <Col lg={4}>
          <InfraMetricKpiCard
            title="Last pending phase duration"
            snapshotId={snapshotId}
            metric="lastDuration"
            formatter={msFormatter}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={4}>
          <Card title="CPU Resources">
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: twoDecimalPlaces,
                metrics: ['pods.required_cpu', 'pods.limit_cpu'],
                labels: ['CPU Requests', 'CPU Limits'],
                type: 'line'
              }}
            />
          </Card>
        </Col>
        <Col lg={4}>
          <Card title="Memory Resources">
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: bytesTwoDecimalPlaces,
                metrics: ['pods.required_mem', 'pods.limit_mem'],
                labels: ['Memory Requests', 'Memory Limits'],
                type: 'line'
              }}
            />
          </Card>
        </Col>
        <Col lg={4}>
          <Card title="Pods">
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: zeroDecimalPlaces,
                metrics: ['pods.count'],
                labels: ['Pods'],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg={4}>
          <Card title="Replicas">
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: zeroDecimalPlaces,
                metrics: ['availableReplicas', 'desiredReplicas'],
                labels: ['Available', 'Desired'],
                type: 'line'
              }}
            />
          </Card>
        </Col>
        <Col lg={4}>
          <Card title="Pods Pending vs Unscheduled vs Unready">
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: zeroDecimalPlaces,
                metrics: ['phase.Pending.count', 'conditions.PodScheduled.False', 'conditions.Ready.False'],
                labels: ['Pending', 'Unscheduled', 'Unready'],
                type: 'line'
              }}
            />
          </Card>
        </Col>
        <Col lg={4}>
          <Card title="Pending phase duration">
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: msFormatter,
                metrics: ['duration'],
                labels: ['Pending phase duration'],
                type: 'line'
              }}
            />
          </Card>
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
