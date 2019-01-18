import React, { Fragment } from 'react';
import { isEmpty } from 'lodash';

import MatchingDeploymentsList from 'in-kubernetes/Dashboards/Service/tabs/Summary/MatchingDeploymentsList';
import MatchingPodsList from 'in-kubernetes/Dashboards/Service/tabs/Summary/MatchingPodsList';
import TopEventsList from 'in-kubernetes/Dashboards/Service/tabs/Summary/TopEventsList';
import { bytesTwoDecimalPlaces, twoDecimalPlaces } from 'in-services/formatters/number';
import { formatDuration } from 'in-services/formatters/date';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import Card from 'in-new-components/Card';
import Chart from 'in-components/Chart';

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

      <Row verticallyStretchColumns>
        <Col lg={4}>
          <MatchingPodsList serviceId={service.id} timeConfig={timeConfig} />
        </Col>
        {!isEmpty(service.deploymentIds) && (
          <Col lg={4}>
            <Card title="CPU Resources (Deployment)" useMaxAvailableHeight>
              <Chart
                snapshotId={service.deploymentIds[0]}
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
        )}
        {!isEmpty(service.deploymentIds) && (
          <Col lg={4}>
            <Card title="Memory Resources (Deployment)" useMaxAvailableHeight>
              <Chart
                snapshotId={service.deploymentIds[0]}
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
        )}
      </Row>

      <Row>
        <Col lg={12}>
          <TopEventsList serviceId={service.id} timeConfig={timeConfig} />
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <MatchingDeploymentsList serviceId={service.id} timeConfig={timeConfig} />
        </Col>
      </Row>
    </Fragment>
  );
}
