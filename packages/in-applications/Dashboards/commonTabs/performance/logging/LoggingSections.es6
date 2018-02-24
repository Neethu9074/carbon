import React, { Fragment } from 'react';

import { getChartGranularity } from 'in-applications/metrics';
import Renderer from 'in-components/Chart/renderer/Renderer';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { Row, Col } from 'in-new-components/layout/Grid';
import LogMessageTopList from './LogMessageTopList';
import Card from 'in-new-components/Card';

export default function LoggingSections({ applicationId, serviceId, endpointId, timeframe }) {
  const granularity = getChartGranularity(timeframe);

  return (
    <Fragment>
      <Row>
        <Col lg={6}>
          <Card title="Log Level Breakdown">
            <ChartWrapper
              timeframe={timeframe}
              y1={{
                renderer: Renderer.bar,
                labels: ['Error logs'],
                metricIds: ['logMessages']
              }}
              metricsConfiguration={{
                filter: {
                  application: applicationId,
                  service: serviceId,
                  endpoint: endpointId,
                  timeframe
                },
                metrics: {
                  logMessages: {
                    metric: 'logMessages',
                    granularity,
                    aggregation: 'SUM'
                  }
                }
              }}
            />
          </Card>
        </Col>
        <Col lg={6}>
          <LogMessageTopList applicationId={applicationId} serviceId={serviceId} timeframe={timeframe} />
        </Col>
      </Row>
    </Fragment>
  );
}
