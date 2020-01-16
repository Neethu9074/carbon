import { get } from 'lodash';
import React from 'react';

import AppdataChartWrapper from 'in-applications/components/AppdataChartWrapper';
import getEndpointTypes from 'in-subscription/application/getEndpointTypes';
import getEndpointInfo from 'in-subscription/application/getEndpointInfo';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getApplication from 'in-subscription/application/getApplication';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { getChartGranularity } from 'in-applications/metrics';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { Row, Col } from 'in-new-components/layout/Grid';
import { number } from 'in-services/formatters/number';
import connectTo from 'in-hoc/connectTo';
import theme from 'in-themes';

export default connectTo(
  ({ applicationId, serviceId, endpointId, timeConfig, boundaryScope }) => ({
    applicationLabel: applicationId ? getApplication({ id: applicationId }).map(getLabel) : null,
    serviceLabel: serviceId ? getServiceLabel({ id: serviceId }).map(getLabel) : null,
    endpointLabel: endpointId ? getEndpointInfo({ id: endpointId }).map(getLabel) : null,
    types: getEndpointTypes({
      filter: {
        application: applicationId,
        service: serviceId,
        endpoint: endpointId,
        timeConfig: timeConfig,
        applicationBoundaryScope: boundaryScope
      }
    }).map(result => result.data || null)
  }),
  function HttpSections({
    timeConfig,
    types,
    applicationId,
    serviceId,
    endpointId,
    boundaryScope,
    applicationLabel,
    serviceLabel,
    endpointLabel,
    filters,
    isSynthetic,
    groupByTag,
    metrics,
    showGraph
  }) {
    if (!hasHttpEndpoints(types)) {
      return null;
    }

    const granularity = getChartGranularity(timeConfig);
    return (
      <Row>
        <Col lg={12}>
          <AppdataChartWrapper
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
                endpoint: endpointId,
                applicationBoundaryScope: boundaryScope
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
            additionalContextMenuButtons={[
              {
                icon: 'lib_analyze',
                label: 'View in Analytics',
                getHref$: highlightedTime =>
                  getLinkToAnalyze({
                    applicationName: applicationLabel,
                    serviceName: serviceLabel,
                    endpointName: endpointLabel,
                    boundaryScope,
                    dataSource: 'calls',
                    filters: isSynthetic
                      ? [
                          { name: 'call.is_synthetic', value: 'true' },
                          { name: 'include_synthetic', value: 'true' },
                          ...filters
                        ]
                      : filters,
                    groupByTag: groupByTag ? groupByTag : {},
                    timeConfig: highlightedTime,
                    metrics: metrics ? metrics : null,
                    showGraph: showGraph ? true : {}
                  })
              }
            ]}
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

function getLabel(result) {
  return get(result, ['data', 'label'], null);
}
