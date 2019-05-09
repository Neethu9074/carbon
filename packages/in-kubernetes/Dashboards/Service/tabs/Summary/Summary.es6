import React, { Fragment } from 'react';
import { isEmpty } from 'lodash';

import { bytesTwoDecimalPlaces, twoDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Endpoints from 'in-kubernetes/Dashboards/Service/tabs/Endpoints';
import { formatDuration } from 'in-services/formatters/date';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import Card from 'in-new-components/Card';

export default function Summary({ timeConfig, data: service }) {
  return (
    <Fragment>
      <Row>
        <Col lg={4}>
          <KpiCard title="Type" value={service.type} raw />
        </Col>
        <Col lg={4}>
          <KpiCard title="Location" value={service.location} raw />
        </Col>
        <Col lg={4}>
          <KpiCard title="Age" value={formatDuration(service.age)} raw />
        </Col>
      </Row>

      {!isEmpty(service.deploymentIds) && (
        <Row verticallyStretchColumns>
          <Col lg={4}>
            <Card title="CPU Resources (Deployments)" useMaxAvailableHeight>
              <Chart
                snapshotId={service.deploymentIds[0]}
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
            <Card title="Memory Resources (Deployments)" useMaxAvailableHeight>
              <Chart
                snapshotId={service.deploymentIds[0]}
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
