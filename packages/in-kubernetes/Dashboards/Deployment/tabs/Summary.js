/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';
import theme from 'in-themes';

import MissingK8sPermissions from 'in-kubernetes/Dashboards/commonComponents/MissingK8sPermissions';
import { zeroDecimalPlaces, timeByMillisTwoDecimalPlaces } from 'in-services/formatters/number';
import ConditionsTableCard from 'in-kubernetes/Dashboards/commonComponents/ConditionsTableCard';
import K8DashboardsMarkerLanes from 'in-kubernetes/Dashboards/K8DashboardsMarkerLanes';
import { resourceQuotaNumber, resourceQuotaBytes } from 'in-kubernetes/formatters';
import InfraMetricKpiCard from 'in-new-components/KpiCard/InfraMetricKpiCard';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { getDeploymentDashboard } from 'in-kubernetes/navigation/paths';
import { Row, Col } from 'in-new-components/layout/Grid';
import Card from 'in-new-components/Card';

const noActivity = 'No activity';
const msFormatter = d => (d < 0 ? noActivity : timeByMillisTwoDecimalPlaces(d));

export default function Summary({ timeConfig, data: deployment }) {
  const snapshotId = deployment.id;
  const {
    orange800: limits,
    lime800: requests,
    lightBlue800: usage,
    orange800: pending,
    lightBlue800: allocated,
    deepPurple800: unscheduled,
    pink800: unready
  } = theme.lib.colors;

  return (
    <Fragment>
      <MissingK8sPermissions resourceSnapshotId={deployment.id} timeConfig={timeConfig} />

      <Row>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="CPU Requests"
            snapshotId={snapshotId}
            metric="pods.required_cpu"
            formatter={resourceQuotaNumber}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="CPU Limits"
            snapshotId={snapshotId}
            metric="pods.limit_cpu"
            formatter={resourceQuotaNumber}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="Memory Requests"
            snapshotId={snapshotId}
            metric="pods.required_mem"
            formatter={resourceQuotaBytes}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="Memory Limits"
            snapshotId={snapshotId}
            metric="pods.limit_mem"
            formatter={resourceQuotaBytes}
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
                formatter: resourceQuotaNumber,
                metrics: ['cpu.total_usage', 'pods.required_cpu', 'pods.limit_cpu'].filter(Boolean),
                labels: ['Usage', 'Requests', 'Limits'].filter(Boolean),
                type: 'line',
                colors: [usage, requests, limits].filter(Boolean)
              }}
              renderPostChartContent={K8DashboardsMarkerLanes}
            />
          </Card>
        </Col>
        <Col lg={4}>
          <Card title="Memory Resources">
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: resourceQuotaBytes,
                metrics: ['memory.usage', 'pods.required_mem', 'pods.limit_mem'].filter(Boolean),
                labels: ['Usage', 'Requests', 'Limits'].filter(Boolean),
                type: 'line',
                colors: [usage, requests, limits].filter(Boolean)
              }}
              renderPostChartContent={K8DashboardsMarkerLanes}
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
                type: 'line',
                colors: [allocated, pending, unscheduled, unready]
              }}
              renderPostChartContent={K8DashboardsMarkerLanes}
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
              renderPostChartContent={K8DashboardsMarkerLanes}
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
              renderPostChartContent={K8DashboardsMarkerLanes}
            />
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <ConditionsTableCard
            conditions={deployment.conditions}
            viewAllHref$={getDeploymentDashboard(snapshotId, { tab: '/conditions' })}
          />
        </Col>
      </Row>
    </Fragment>
  );
}
