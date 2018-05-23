import React from 'react';

import getEndpointTypes from 'in-subscription/application/getEndpointTypes';
import { getChartGranularity } from 'in-applications/metrics';
import Renderer from 'in-components/Chart/renderer/Renderer';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { Row, Col } from 'in-new-components/layout/Grid';
import { number } from 'in-services/formatters/number';
import connectTo from 'in-hoc/connectTo';
import theme from 'in-themes';

export default connectTo(
  props => ({
    types: getEndpointTypes({
      filter: {
        application: props.applicationId,
        service: props.serviceId,
        endpoint: props.endpointId,
        timeConfig: props.timeConfig
      }
    }).map(result => result.data || null)
  }),
  function HttpSections({ timeConfig, types, applicationId, serviceId, endpointId }) {
    if (!hasHttpEndpoints(types)) {
      return null;
    }

    const granularity = getChartGranularity(timeConfig);
    return (
      <Row>
        <Col lg={12}>
          <ChartWrapper
            cardTitle="Http Status Code Breakdown"
            timeConfig={timeConfig}
            y1={{
              renderer: Renderer.stackedArea,
              labels: ['1XX', '2XX', '3XX', '4XX', '5XX'],
              formatter: number,
              tooltipFormatter: number.compact,
              metricIds: ['http.1xx', 'http.2xx', 'http.3xx', 'http.4xx', 'http.5xx'],
              colors: [
                theme.lib.colors.chart.strokeColors25[0],
                theme.lib.colors.chart.strokeColors25[1],
                theme.lib.colors.chart.strokeColors25[4],
                theme.lib.colors.chart.strokeColors25[2],
                theme.lib.colors.chart.strokeColors25[6]
              ]
            }}
            metricsConfiguration={{
              filter: {
                timeConfig,
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
