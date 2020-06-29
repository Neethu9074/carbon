import theme from 'in-themes';
import React from 'react';

import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import AppdataChartWrapper from 'in-applications/components/AppdataChartWrapper';
import getEndpointTypes from 'in-subscription/application/getEndpointTypes';
import { getChartGranularity } from 'in-applications/metrics';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { number } from 'in-services/formatters/number';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ applicationId, serviceId, endpointId, timeConfig, boundaryScope }) => ({
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
    filters,
    isSynthetic,
    groupByTag,
    metrics,
    renderPostChartContent
  }) {
    if (!hasHttpEndpoints(types)) {
      return null;
    }

    const granularity = getChartGranularity(timeConfig);
    const metricsIds = ['http.1xx', 'http.2xx', 'http.3xx', 'http.4xx', 'http.5xx'];
    return (
      <AppdataChartWrapper
        renderPostChartContent={renderPostChartContent}
        timeConfig={timeConfig}
        y1={{
          renderer: Renderer.stackedBar,
          labels: ['1XX', '2XX', '3XX', '4XX', '5XX'],
          formatter: number,
          tooltipFormatter: number.compact,
          metricIds: metricsIds,
          colors: [
            theme.lib.colors.chart.strokeColors25[8],
            theme.lib.colors.chart.strokeColors25[1],
            theme.lib.colors.chart.strokeColors25[4],
            theme.lib.colors.warning,
            theme.lib.colors.failure
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
          },
          reverseOrder: true
        }}
        primaryContextMenuAction="analyze"
        additionalContextMenuButtons={[
          {
            name: 'analyze',
            icon: 'lib_analyze',
            label: 'View in Analytics',
            getHref$: (highlightedTime, metricsToAdd) =>
              getJumpToAnalyzeHref$(
                {
                  applicationId,
                  serviceId,
                  endpointId
                },
                {
                  boundaryScope,
                  dataSource: 'calls',
                  filters: isSynthetic
                    ? [
                        { name: 'call.is_synthetic', value: 'true' },
                        { name: 'include_synthetic', value: 'true' },
                        ...mapMetricsToAdd(filters, metricsToAdd.renderedMetrics, metricsIds)
                      ]
                    : mapMetricsToAdd(filters, metricsToAdd.renderedMetrics, metricsIds),
                  groupByTag: groupByTag ? groupByTag : {},
                  timeConfig: highlightedTime,
                  metrics: metrics ? metrics : null
                }
              )
          }
        ]}
      />
    );
  }
);

// Needs to add not rendered metrics to array
function mapMetricsToAdd(filters, renderedMetrics, metricIds) {
  const metricsForLink = filters ? [...filters] : [];
  const filteredArr = metricIds.filter(metric => !renderedMetrics.includes(metric));
  filteredArr.map(metric => {
    metricsForLink.push({
      name: 'call.http.status',
      operator: 'NOT_STARTS_WITH',
      value: correctValue(metric)
    });
  });

  return metricsForLink;
}

function correctValue(metric) {
  switch (metric) {
    case 'http.1xx':
      return '1';
    case 'http.2xx':
      return '2';
    case 'http.3xx':
      return '3';
    case 'http.4xx':
      return '4';
    case 'http.5xx':
      return '5';
  }
}

function hasHttpEndpoints(types) {
  if (!types) {
    return false;
  }
  return hasType('HTTP', types);
}

function hasType(type, types) {
  return types.indexOf(type) >= 0;
}
