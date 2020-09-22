import theme from 'in-themes';
import React from 'react';

import { EQUALS, NOT_STARTS_WITH, STARTS_WITH } from 'in-new-components/QueryBuilder/tagFilter/operators';
import UnifiedMetricsChart, { parseMetricId } from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { NOT_APPLICABLE } from 'in-new-components/QueryBuilder/tagFilter/entities';
import getEndpointTypes from 'in-applications/subscriptions/getEndpointTypes';
import { getChartGranularity } from 'in-applications/metrics';
import { stackedBar, line } from 'in-stores/metric/renderer';
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
    tagFilters,
    boundaryScope,
    filters,
    isSynthetic,
    groupByTag,
    metrics,
    renderPostChartContentHttpStatus,
    timeShiftConfig,
    timeShiftMetric
  }) {
    if (!hasHttpEndpoints(types)) {
      return null;
    }
    const granularity = getChartGranularity(timeConfig);

    const defaultMetricConfig = {
      granularity,
      aggregation: 'SUM',
      source: 'APPLICATION',
      tagFilters: tagFilters,
      timeConfig: timeConfig,
      timeShift: 0
    };

    const statusMetrics = [
      {
        ...defaultMetricConfig,
        metric: 'http.1xx',
        label: '1XX',
        color: theme.lib.colors.chart.strokeColors25[8]
      },
      {
        ...defaultMetricConfig,
        metric: 'http.2xx',
        label: '2XX',
        color: theme.lib.colors.chart.strokeColors25[1]
      },
      {
        ...defaultMetricConfig,
        metric: 'http.3xx',
        label: '3XX',
        color: theme.lib.colors.chart.strokeColors25[4]
      },
      {
        ...defaultMetricConfig,
        metric: 'http.4xx',
        label: '4XX',
        color: theme.lib.colors.warning
      },
      {
        ...defaultMetricConfig,
        metric: 'http.5xx',
        label: '5XX',
        color: theme.lib.colors.failure
      }
    ];

    let metricsConfig;
    let renderer;
    let colors;
    if (timeShiftConfig.offset) {
      const timeShiftMetricConfig = statusMetrics.find(m => m.metric === timeShiftMetric) ?? statusMetrics[0];
      metricsConfig = [
        {
          ...timeShiftMetricConfig,
          timeShift: timeShiftConfig.offset
        },
        // make sure the main metric renders over the time shifted metric
        {
          ...timeShiftMetricConfig
        }
      ];
      colors = [theme.lib.colors.timeShift, timeShiftMetricConfig.color];
      renderer = line.id;
    } else {
      metricsConfig = statusMetrics;
      colors = metricsConfig.map(m => m.color);
      renderer = stackedBar.id;
    }

    return (
      <UnifiedMetricsChart
        renderPostChartContent={renderPostChartContentHttpStatus}
        timeConfig={timeConfig}
        automaticallySize={false}
        reverseLegendOrder={timeShiftConfig.offset}
        reverseTooltipOrder={timeShiftConfig.offset}
        config={{
          y1: {
            metrics: metricsConfig,
            colors: colors,
            formatter: 'number.compact',
            tooltipFormatter: number.compact,
            renderer: renderer
          },
          y2: {
            metrics: []
          },
          reverseOrder: true,
          type: 'TIME_SERIES',
          primaryContextMenuAction: 'analyze',
          additionalContextMenuButtons: [
            {
              name: 'analyze',
              icon: 'lib_analyze',
              label: 'View in Analyze',
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
                          { name: 'call.type', value: 'HTTP', operator: EQUALS, entity: NOT_APPLICABLE },
                          ...mapMetricsToAdd(filters, metricsToAdd.renderedMetrics, metricsConfig, timeShiftConfig)
                        ]
                      : [
                          { name: 'call.type', value: 'HTTP', operator: EQUALS, entity: NOT_APPLICABLE },
                          ...mapMetricsToAdd(filters, metricsToAdd.renderedMetrics, metricsConfig, timeShiftConfig)
                        ],
                    groupByTag: groupByTag ? groupByTag : {},
                    timeConfig: highlightedTime,
                    metrics: metrics ? metrics : null
                  }
                )
            }
          ]
        }}
      />
    );
  }
);

// Needs to add not rendered metrics to array
function mapMetricsToAdd(filters, renderedMetrics, metrics, timeShiftConfig) {
  const metricsForLink = filters ? [...filters] : [];
  if (timeShiftConfig.offset) {
    metricsForLink.push({
      name: 'call.http.status',
      operator: STARTS_WITH,
      value: correctValue(metrics[0].metric)
    });
  } else {
    const activeMetrics = renderedMetrics.map(metricId => metrics[parseMetricId(metricId).index].metric);
    const filteredArr = metrics.filter(metric => !activeMetrics.includes(metric));
    filteredArr.map(metric => {
      metricsForLink.push({
        name: 'call.http.status',
        operator: NOT_STARTS_WITH,
        value: correctValue(metric)
      });
    });
  }
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
