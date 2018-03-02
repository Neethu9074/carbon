import React from 'react';

import getEndpointTypes from 'in-subscription/application/getEndpointTypes';
import { getChartGranularity } from 'in-applications/metrics';
import Renderer from 'in-components/Chart/renderer/Renderer';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { Row, Col } from 'in-new-components/layout/Grid';
import { millis } from 'in-services/formatters/number';
import Card from 'in-new-components/Card';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    types: getEndpointTypes({
      filter: {
        application: props.applicationId,
        service: props.serviceId,
        endpoint: props.endpointId,
        timeframe: props.timeframe
      }
    }).map(result => result.data || null)
  }),
  function HttpSections({ timeframe, types, applicationId, serviceId, endpointId }) {
    if (!hasHttpEndpoints(types)) {
      return null;
    }

    const granularity = getChartGranularity(timeframe);
    return (
      <Row>
        <Col lg={12}>
          <Card title="Http Status Code Breakdown">
            <ChartWrapper
              timeframe={timeframe}
              y1={{
                renderer: Renderer.stackedArea,
                labels: ['1XX', '2XX', '3XX', '4XX', '5XX'],
                colors: ['#3dafe7', '#389dcc', '#5b83de', '#9aa4ff', '#bcdbff'],
                formatter: millis,
                metricIds: ['http.1xx', 'http.2xx', 'http.3xx', 'http.4xx', 'http.5xx']
              }}
              metricsConfiguration={{
                filter: {
                  timeframe,
                  application: applicationId,
                  service: serviceId,
                  endpoint: endpointId
                },
                metrics: {
                  'http.1xx': {
                    metric: 'http.1xx',
                    granularity,
                    aggregation: 'SUM'
                  },
                  'http.2xx': {
                    metric: 'http.2xx',
                    granularity,
                    aggregation: 'SUM'
                  },
                  'http.3xx': {
                    metric: 'http.3xx',
                    granularity,
                    aggregation: 'SUM'
                  },
                  'http.4xx': {
                    metric: 'http.4xx',
                    granularity,
                    aggregation: 'SUM'
                  },
                  'http.5xx': {
                    metric: 'http.5xx',
                    granularity,
                    aggregation: 'SUM'
                  }
                }
              }}
            />
          </Card>
        </Col>
      </Row>
    );
  }
);

function hasHttpEndpoints(types) {
  if (!types) {
    return false;
  }
  return hasType('HTTP', types);
}

function hasType(type, types) {
  return types.indexOf(type) >= 0;
}
