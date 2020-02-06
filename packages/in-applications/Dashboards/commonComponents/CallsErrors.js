import React from 'react';

import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import AppdataChartWrapper from 'in-applications/components/AppdataChartWrapper';
import { getChartGranularity } from 'in-applications/metrics';
import Renderer from 'in-components/Chart/renderer/Renderer';
import theme from 'in-themes';

export default function CallsErrors({
  applicationId,
  serviceId,
  endpointId,
  timeConfig,
  isSynthetic,
  groupByTag,
  includeSyntheticCalls,
  boundaryScope,
  cardTitle
}) {
  const granularity = getChartGranularity(timeConfig);

  return (
    <AppdataChartWrapper
      cardTitle={cardTitle}
      timeConfig={timeConfig}
      y1={{
        renderer: Renderer.bar,
        labels: ['Calls', 'Erroneous Calls'],
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
      additionalContextMenuButtons={[
        {
          icon: 'lib_analyze',
          label: 'View in Analytics',
          getHref$: highlightedTime =>
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
                ]
              }
            )
        }
      ]}
    />
  );
}
