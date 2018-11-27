import React, { Fragment } from 'react';

import AppdataChartWrapper from 'in-applications/components/AppdataChartWrapper';
import { getChartGranularity } from 'in-applications/metrics';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { formatDuration } from 'in-services/formatters/date';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';

export default function Summary({ timeConfig, data: service }) {
  const granularity = getChartGranularity(timeConfig);

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

      <Row>
        <Col lg={4}>
          <KpiCard title="Matching Pods" value={service.pods} raw />
        </Col>
        <Col lg={4}>
          <KpiCard title="CPU Usage" value={service.cpuUsage} raw />
        </Col>
        <Col lg={4}>
          <KpiCard title="Memory Usage" value={service.memoryUsed} raw />
        </Col>
      </Row>

      <Row>
        <Col lg={4}>
          <AppdataChartWrapper
            cardTitle="CPU Resources (cpu units)"
            timeConfig={timeConfig}
            y1={{
              renderer: Renderer.countErrorBar,
              labels: ['Used', 'Requests', 'Limits'],
              metricIds: ['used', 'requests', 'limits']
            }}
            metricsConfiguration={{
              filter: {
                timeConfig,
                service: service.id
              },
              metrics: {
                used: {
                  metric: 'used',
                  granularity,
                  aggregation: 'MEAN'
                },
                requests: {
                  metric: 'requests',
                  granularity,
                  aggregation: 'MEAN'
                },
                limits: {
                  metric: 'limits',
                  granularity,
                  aggregation: 'MEAN'
                }
              }
            }}
          />
        </Col>
        <Col lg={4}>
          <AppdataChartWrapper
            cardTitle="Memory Resources (GiB)"
            timeConfig={timeConfig}
            y1={{
              renderer: Renderer.countErrorBar,
              labels: ['Used', 'Requests', 'Limits'],
              metricIds: ['used', 'requests', 'limits']
            }}
            metricsConfiguration={{
              filter: {
                timeConfig,
                service: service.id
              },
              metrics: {
                used: {
                  metric: 'used',
                  granularity,
                  aggregation: 'MEAN'
                },
                requests: {
                  metric: 'requests',
                  granularity,
                  aggregation: 'MEAN'
                },
                limits: {
                  metric: 'limits',
                  granularity,
                  aggregation: 'MEAN'
                }
              }
            }}
          />
        </Col>
      </Row>
    </Fragment>
  );
}
