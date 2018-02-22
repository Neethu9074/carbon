import React, { Fragment } from 'react';

import { getEndpointDashboard } from 'in-applications/navigation/paths';
import getEndpoints from 'in-subscription/application/getEndpoints';
import Renderer from 'in-components/Chart/renderer/Renderer';
import Chart from 'in-components/Chart/ChartReactComponent';
import ServerTable from 'in-components/tables/ServerTable';
import { Row, Col } from 'in-new-components/layout/Grid';
import { number } from 'in-services/formatters/number';
import LogMessageTopList from './LogMessageTopList';
import { compare } from 'in-services/util/number';
import Card from 'in-new-components/Card';
import Link from 'in-components/Link';

const columnDefinitions = [
  {
    id: 'endpointLabel',
    label: 'Endpoint',
    getContent(item, { applicationId, serviceId }) {
      return (
        <Link href$={getEndpointDashboard(item.endpoint.id, { applicationId, serviceId })}>{item.endpoint.label}</Link>
      );
    }
  },
  {
    id: 'serviceLabel',
    label: 'Service',
    getContent(item, { serviceLabel }) {
      return serviceLabel;
    }
  },
  {
    id: 'logMessages',
    label: 'Messages',
    getContent(item) {
      return item.metrics.logMessages;
    }
  }
];

export default function LoggingSections({ applicationId, serviceId, timeframe, data }) {
  return (
    <Fragment>
      <Row>
        <Col lg={6}>
          <Card title="Log Level Breakdown">
            <Chart
              timeframe={timeframe}
              y1={{
                renderer: Renderer.stackedArea,
                labels: ['Error', 'Warn'],
                formatter: number,
                metrics: [generateMetrics(timeframe), generateMetrics(timeframe)]
              }}
            />
          </Card>
        </Col>
        <Col lg={6}>
          <LogMessageTopList applicationId={applicationId} serviceId={serviceId} timeframe={timeframe} />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <Card title="Top Endpoints by Log Volume">
            {/* TODO Filter by log level */}
            <ServerTable
              get={getTableData}
              applicationId={applicationId}
              serviceId={serviceId}
              serviceLabel={data.label}
              pageSize={10}
              timeframe={timeframe}
              columnDefinitions={columnDefinitions}
            />
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}

function generateMetrics(timeframe, maxValue = 100, numMetrics) {
  const metrics = [];
  numMetrics = numMetrics || timeframe.windowSize / 5000;
  for (let i = numMetrics; i >= 0; i--) {
    metrics[i] = [timeframe.to - i * (timeframe.windowSize / numMetrics), ((Math.random() * maxValue * 100) | 0) / 100];
  }
  metrics.sort((a, b) => compare(a[0], b[0]));
  return metrics;
}

function getTableData({ page, pageSize, applicationId, serviceId, timeframe }) {
  return getEndpoints({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: 'logMessages',
      direction: 'DESC'
    },
    filter: {
      application: applicationId,
      service: serviceId,
      timeframe
    },
    metrics: {
      logMessages: {
        metric: 'logMessages',
        aggregation: 'SUM'
      }
    }
  });
}
