import React, { Fragment } from 'react';

import { bytesTwoDecimalPlaces, twoDecimalPlaces } from 'in-services/formatters/number';
import InfraMetricKpiCard from 'in-new-components/KpiCard/InfraMetricKpiCard';
import { isAdhocMetricAggregationEnabled } from 'in-services/featureFlags';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Endpoints from 'in-kubernetes/Dashboards/Service/tabs/Endpoints';
import KpiGridRow from 'in-new-components/KpiGridRow/KpiGridRow';
import { formatDuration } from 'in-services/formatters/date';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import Card from 'in-new-components/Card';

const showUsage = isAdhocMetricAggregationEnabled;

export default function Summary({ timeConfig, data: service }) {
  const deploymentId = service.deploymentIds && service.deploymentIds[0];

  return (
    <Fragment>
      <KpiGridRow sizes={[4, 4, 4]}>
        <KpiCard title="Type" value={service.type} raw borderless />
        <KpiCard title="Location" value={service.location} raw borderless />
        <KpiCard title="Age" value={formatDuration(service.age)} raw borderless />
      </KpiGridRow>

      {deploymentId && (
        <Row>
          <Col lg={3}>
            <InfraMetricKpiCard
              title="CPU Req."
              snapshotId={deploymentId}
              metric="pods.required_cpu"
              formatter={twoDecimalPlaces}
            />
          </Col>
          <Col lg={3}>
            <InfraMetricKpiCard
              title="CPU Limits"
              snapshotId={deploymentId}
              metric="pods.limit_cpu"
              formatter={twoDecimalPlaces}
            />
          </Col>
          <Col lg={3}>
            <InfraMetricKpiCard
              title="Memory Req."
              snapshotId={deploymentId}
              metric="pods.required_mem"
              formatter={bytesTwoDecimalPlaces}
            />
          </Col>
          <Col lg={3}>
            <InfraMetricKpiCard
              title="Memory Limits"
              snapshotId={deploymentId}
              metric="pods.limit_mem"
              formatter={bytesTwoDecimalPlaces}
            />
          </Col>
        </Row>
      )}

      {deploymentId && (
        <Row verticallyStretchColumns>
          <Col lg={6}>
            <Card title="CPU Resources (Deployment)" useMaxAvailableHeight>
              <Chart
                snapshotId={deploymentId}
                timeConfig={timeConfig}
                y1={{
                  formatter: twoDecimalPlaces,
                  metrics: ['pods.required_cpu', 'pods.limit_cpu', showUsage && 'cpu.user_usage'].filter(Boolean),
                  labels: ['Requests', 'Limits', showUsage && 'Usage'].filter(Boolean),
                  type: 'line'
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
                  formatter: bytesTwoDecimalPlaces,
                  metrics: ['pods.required_mem', 'pods.limit_mem', showUsage && 'cpu.user_usage'].filter(Boolean),
                  labels: ['Requests', 'Limits', showUsage && 'Usage'].filter(Boolean),
                  type: 'line'
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
