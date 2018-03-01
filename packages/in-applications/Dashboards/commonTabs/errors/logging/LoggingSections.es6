import React, { Fragment } from 'react';

import LogMessageTopList from 'in-applications/Dashboards/commonTabs/errors/logging/LogMessageTopList';
import { getChartGranularity } from 'in-applications/metrics';
import Renderer from 'in-components/Chart/renderer/Renderer';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { Row, Col } from 'in-new-components/layout/Grid';
import Card from 'in-new-components/Card';

export default function LoggingSections({ applicationId, serviceId, endpointId, timeframe }) {
  const granularity = getChartGranularity(timeframe);

  return (
    <Fragment>
      <Row>
        <Col lg={12}>
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
      </Row>

      <Row>
        <Col lg={12}>
          <LogMessageTopList
            applicationId={applicationId}
            serviceId={serviceId}
            endpointId={endpointId}
            timeframe={timeframe}
          />
        </Col>
      </Row>
    </Fragment>
  );
}
