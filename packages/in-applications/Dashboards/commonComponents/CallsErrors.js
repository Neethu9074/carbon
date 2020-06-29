import theme from 'in-themes';
import React from 'react';

import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import AppdataChartWrapper from 'in-applications/components/AppdataChartWrapper';
import { getChartGranularity } from 'in-applications/metrics';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { number } from 'in-services/formatters/number';

export default function CallsErrors({
  applicationId,
  serviceId,
  endpointId,
  timeConfig,
  isSynthetic,
  groupByTag,
  includeSyntheticCalls,
  boundaryScope,
  cardTitle,
  renderPostChartContent
}) {
  const granularity = getChartGranularity(timeConfig);
  const labels = ['Calls', 'Erroneous Calls'];
  return (
    <AppdataChartWrapper
      renderPostChartContent={renderPostChartContent}
      cardTitle={cardTitle}
      timeConfig={timeConfig}
      y1={{
        renderer: Renderer.barOverlapping,
        labels: labels,
        formatter: number.compact,
        metricIds: ['calls', 'erroneousCalls'],
        colors: [theme.lib.colors.lightPrimary240, theme.lib.colors.failure]
      }}
      metricsConfiguration={{
        filter: {
          timeConfig,
          endpoint: endpointId,
          application: applicationId,
          service: serviceId,
          applicationBoundaryScope: boundaryScope,
          includeSyntheticCalls
        },
        metrics: {
          calls: {
            metric: 'calls',
            granularity,
            aggregation: 'SUM'
          },
          erroneousCalls: {
            metric: 'erroneousCalls',
            granularity,
            aggregation: 'SUM'
          }
        }
      }}
      primaryContextMenuAction="analyze"
      additionalContextMenuButtons={[
        {
          name: 'analyze',
          icon: 'lib_analyze',
          label: 'View in Analytics',
          getHref$: (highlightedTime, config) =>
            getJumpToAnalyzeHref$(
              { applicationId, serviceId, endpointId },
              {
                timeConfig: highlightedTime,
                boundaryScope,
                groupByTag,
                filters: isSynthetic
                  ? [{ name: 'call.is_synthetic', value: 'true' }, { name: 'include_synthetic', value: 'true' }]
                  : [],
                metrics: [
                  { metric: 'erroneousCalls', aggregation: 'SUM' },
                  {
                    metric: 'latency',
                    aggregation: 'MEAN'
                  }
                ],
                focusedMetric: focusBasedOnMetrics(config)
              }
            )
        }
      ]}
    />
  );
}

function focusBasedOnMetrics(config) {
  if (config.renderedMetrics[0] === 'erroneousCalls') {
    return 'erroneousCalls_SUM';
  }
  return 'calls_SUM';
}
