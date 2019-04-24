import React, { Fragment } from 'react';

import {
  zeroDecimalPlaces,
  twoDecimalPlaces,
  bytesTwoDecimalPlaces,
  timeByMillisTwoDecimalPlaces
} from 'in-services/formatters/number';
import NodeConditionsPresenter from 'in-kubernetes/Dashboards/commonComponents/ConditionsTableCard/NodeConditionsPresenter';
import MetricBasedTwoValueBar from 'in-kubernetes/Dashboards/commonComponents/MetricBasedTwoValueBar';
import MatchingServicesList from 'in-kubernetes/Dashboards/Deployment/tabs/MatchingServicesList';
import ConditionsTableCard from 'in-kubernetes/Dashboards/commonComponents/ConditionsTableCard';
import InfraMetricKpiCard from 'in-new-components/KpiCard/InfraMetricKpiCard';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { getDeploymentDashboard } from 'in-kubernetes/navigation/paths';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import Card from 'in-new-components/Card';

const noActivity = 'No activity';
const msFormatter = d => (d < 0 ? noActivity : timeByMillisTwoDecimalPlaces(d));

export default function Summary({ timeConfig, data: deployment }) {
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
                timeWindowAggregation={null}
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
                labels: ['Requests', 'Limits'],
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
                labels: ['Requests', 'Limits'],
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
                labels: ['Allocated'],
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
          <MatchingServicesList timeConfig={timeConfig} deploymentId={snapshotId} />
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <ConditionsTableCard
            conditions={deployment.conditions}
            viewAllHref$={getDeploymentDashboard(snapshotId, { tab: '/conditions' })}
            TablePresenter={NodeConditionsPresenter}
          />
        </Col>
      </Row>
    </Fragment>
  );
}
