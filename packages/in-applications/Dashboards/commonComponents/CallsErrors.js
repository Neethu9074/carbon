import React from 'react';

import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import AppdataChartWrapper from 'in-applications/components/AppdataChartWrapper';
import { getChartGranularity } from 'in-applications/metrics';
import Renderer from 'in-components/Chart/renderer/Renderer';

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
        renderer: Renderer.countErrorBar,
        labels: ['Calls', 'Errors'],
        metricIds: ['calls', 'errors']
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
          errors: {
            metric: 'errors',
            granularity,
            aggregation: 'MEAN'
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
                  { metric: 'errors', aggregation: 'MEAN' },
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
