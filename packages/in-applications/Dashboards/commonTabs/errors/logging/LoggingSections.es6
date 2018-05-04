import React, { Fragment } from 'react';

import LogMessageTopList from 'in-applications/Dashboards/commonTabs/errors/logging/LogMessageTopList';
import { getChartGranularity } from 'in-applications/metrics';
import Renderer from 'in-components/Chart/renderer/Renderer';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { Row, Col } from 'in-new-components/layout/Grid';
import { number } from 'in-services/formatters/number';
import Card from 'in-new-components/Card';
import theme from 'in-themes';

export default function LoggingSections({ applicationId, serviceId, endpointId, timeConfig }) {
  const granularity = getChartGranularity(timeConfig);
  return (
    <Fragment>
      <Row>
        <Col lg={12}>
          <Card title="Log Level Breakdown">
            <ChartWrapper
              timeConfig={timeConfig}
              y1={{
                tooltipFormatter: number.compact,
                renderer: Renderer.stackedArea,
                labels: ['WARN', 'ERROR'],
                colors: [theme.app20Chart.strokeColors25[2], theme.app20Chart.strokeColors25[4]],
                metricIds: ['logs.warn', 'logs.error']
              }}
              metricsConfiguration={{
                filter: {
                  application: applicationId,
                  service: serviceId,
                  endpoint: endpointId,
                  timeConfig
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
            timeConfig={timeConfig}
          />
        </Col>
      </Row>
    </Fragment>
  );
}
