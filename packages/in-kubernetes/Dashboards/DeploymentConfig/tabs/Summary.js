import React, { Fragment } from 'react';

import {
  zeroDecimalPlaces,
  twoDecimalPlaces,
  bytesTwoDecimalPlaces,
  timeByMillisTwoDecimalPlaces
} from 'in-services/formatters/number';
import ConditionsTableCard from 'in-kubernetes/Dashboards/commonComponents/ConditionsTableCard';
import InfraMetricKpiCard from 'in-new-components/KpiCard/InfraMetricKpiCard';
import { getDeploymentConfigDashboard } from 'in-kubernetes/navigation/paths';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { Row, Col } from 'in-new-components/layout/Grid';
import Card from 'in-new-components/Card';

const noActivity = 'No activity';
const msFormatter = d => (d < 0 ? noActivity : timeByMillisTwoDecimalPlaces(d));

export default function Summary({ timeConfig, data: deploymentConfig }) {
  const snapshotId = deploymentConfig.id;

  return (
    <Fragment>
      <Row>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="CPU Req."
            snapshotId={snapshotId}
            metric="pods.required_cpu"
            formatter={twoDecimalPlaces}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="CPU Limits"
            snapshotId={snapshotId}
            metric="pods.limit_cpu"
            formatter={twoDecimalPlaces}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="Memory Req."
            snapshotId={snapshotId}
            metric="pods.required_mem"
            formatter={bytesTwoDecimalPlaces}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="Memory Limits"
            snapshotId={snapshotId}
            metric="pods.limit_mem"
            formatter={bytesTwoDecimalPlaces}
          />
        </Col>
        <Col lg={4}>
          <InfraMetricKpiCard
            title="Pods Alloc."
            snapshotId={snapshotId}
            metric="pods.count"
            formatter={zeroDecimalPlaces}
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
                metrics: [
                  'pods.count',
                  'phase.Pending.count',
                  'conditions.PodScheduled.False',
                  'conditions.Ready.False'
                ],
                labels: ['Allocated', 'Pending', 'Unscheduled', 'Unready'],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
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
        <Col lg={6}>
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
          <ConditionsTableCard
            conditions={deploymentConfig.conditions}
            viewAllHref$={getDeploymentConfigDashboard(snapshotId, { tab: '/conditions' })}
          />
        </Col>
      </Row>
    </Fragment>
  );
}
