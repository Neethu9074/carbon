import React, { Fragment } from 'react';

import LogMessageTopList from 'in-applications/Dashboards/commonTabs/errors/logging/LogMessageTopList';
import { getChartGranularity } from 'in-applications/metrics';
import Renderer from 'in-components/Chart/renderer/Renderer';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { Row, Col } from 'in-new-components/layout/Grid';
import { number } from 'in-services/formatters/number';
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
                tooltipFormatter: number.compact,
                renderer: Renderer.stackedArea,
                labels: ['WARN', 'ERROR'],
                metricIds: ['logs.warn', 'logs.error']
              }}
              metricsConfiguration={{
                filter: {
                  application: applicationId,
                  service: serviceId,
                  endpoint: endpointId,
                  timeframe
                },
                metrics: {
                  'logs.warn': {
                    metric: 'logs.warn',
                    granularity,
                    aggregation: 'SUM'
                  },
                  'logs.error': {
                    metric: 'logs.error',
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
