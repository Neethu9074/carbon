import React, { Fragment } from 'react';

import { twoDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { resourceQuotaBytes, resourceQuotaNumber } from 'in-kubernetes/formatters';
import InfraMetricKpiCard from 'in-new-components/KpiCard/InfraMetricKpiCard';
import { isAdhocMetricAggregationEnabled } from 'in-services/featureFlags';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Endpoints from 'in-kubernetes/Dashboards/Service/tabs/Endpoints';
import KpiGridRow from 'in-new-components/KpiGridRow/KpiGridRow';
import { formatDuration } from 'in-services/formatters/date';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import Card from 'in-new-components/Card';
import theme from 'in-themes';

export default function Summary({ timeConfig, data: service }) {
  const snapshotId = service.id;
  const deploymentId = service.deploymentIds && service.deploymentIds[0];
  const { orange800: limits, lime800: requests, lightBlue800: usage } = theme.lib.colors;

  const showDeploymentMetrics = !isAdhocMetricAggregationEnabled && deploymentId;

  return (
    <Fragment>
      <KpiGridRow sizes={[4, 4, 4]}>
        <KpiCard title="Type" value={service.type} raw borderless />
        <KpiCard title="Location" value={service.location} raw borderless />
        <KpiCard title="Age" value={formatDuration(service.age)} raw borderless />
      </KpiGridRow>

      {showDeploymentMetrics && (
        <Row>
          <Col lg={3}>
            <InfraMetricKpiCard
              title="CPU Req."
              snapshotId={deploymentId}
              metric="pods.required_cpu"
              formatter={resourceQuotaNumber}
            />
          </Col>
          <Col lg={3}>
            <InfraMetricKpiCard
              title="CPU Limits"
              snapshotId={deploymentId}
              metric="pods.limit_cpu"
              formatter={resourceQuotaNumber}
            />
          </Col>
          <Col lg={3}>
            <InfraMetricKpiCard
              title="Memory Req."
              snapshotId={deploymentId}
              metric="pods.required_mem"
              formatter={resourceQuotaBytes}
            />
          </Col>
          <Col lg={3}>
            <InfraMetricKpiCard
              title="Memory Limits"
              snapshotId={deploymentId}
              metric="pods.limit_mem"
              formatter={resourceQuotaBytes}
            />
          </Col>
        </Row>
      )}

      {showDeploymentMetrics && (
        <Row verticallyStretchColumns>
          <Col lg={6}>
            <Card title="CPU Resources (Deployment)" useMaxAvailableHeight>
              <Chart
                snapshotId={deploymentId}
                timeConfig={timeConfig}
                y1={{
                  formatter: resourceQuotaNumber,
                  metrics: ['pods.required_cpu', 'pods.limit_cpu'],
                  labels: ['Requests', 'Limits'],
                  type: 'line',
                  colors: [requests, limits]
                }}
              />
            </Card>
          </Col>
          <Col lg={6}>
            <Card title="Memory Resources (Deployment)" useMaxAvailableHeight>
              <Chart
                snapshotId={deploymentId}
                timeConfig={timeConfig}
                y1={{
                  formatter: resourceQuotaBytes,
                  metrics: ['pods.required_mem', 'pods.limit_mem'],
                  labels: ['Requests', 'Limits'],
                  type: 'line',
                  colors: [requests, limits]
                }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {isAdhocMetricAggregationEnabled && (
        <Row>
          <Col lg={2}>
            <InfraMetricKpiCard
              title="CPU Usage"
              snapshotId={snapshotId}
              metric="cpu.user_usage"
              formatter={twoDecimalPlaces}
            />
          </Col>
          <Col lg={2}>
            <InfraMetricKpiCard
              title="CPU Req."
              snapshotId={snapshotId}
              metric="cpuRequests"
              formatter={resourceQuotaNumber}
            />
          </Col>
          <Col lg={2}>
            <InfraMetricKpiCard
              title="CPU Limits"
              snapshotId={snapshotId}
              metric="cpuLimits"
              formatter={resourceQuotaNumber}
            />
          </Col>
          <Col lg={2}>
            <InfraMetricKpiCard
              title="Memory Usage"
              snapshotId={snapshotId}
              metric="memory.usage"
              formatter={bytesTwoDecimalPlaces}
            />
          </Col>
          <Col lg={2}>
            <InfraMetricKpiCard
              title="Memory Req."
              snapshotId={snapshotId}
              metric="memoryRequests"
              formatter={resourceQuotaBytes}
            />
          </Col>
          <Col lg={2}>
            <InfraMetricKpiCard
              title="Memory Limits"
              snapshotId={snapshotId}
              metric="memoryLimits"
              formatter={resourceQuotaBytes}
            />
          </Col>
        </Row>
      )}

      {isAdhocMetricAggregationEnabled && (
        <Row verticallyStretchColumns>
          <Col lg={6}>
            <Card title="CPU Resources" useMaxAvailableHeight>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  formatter: resourceQuotaNumber,
                  metrics: ['cpu.user_usage', 'cpuRequests', 'cpuLimits'],
                  labels: ['Usage', 'Requests', 'Limits'],
                  type: 'line',
                  colors: [usage, requests, limits]
                }}
              />
            </Card>
          </Col>
          <Col lg={6}>
            <Card title="Memory Resources" useMaxAvailableHeight>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  formatter: resourceQuotaBytes,
                  metrics: ['memory.usage', 'memoryRequests', 'memoryLimits'],
                  labels: ['Usage', 'Requests', 'Limits'],
                  type: 'line',
                  colors: [usage, requests, limits]
                }}
              />
            </Card>
          </Col>
        </Row>
      )}

      <Row>
        <Col lg={12}>
          <Endpoints timeConfig={timeConfig} service={service} />
        </Col>
      </Row>
    </Fragment>
  );
}
