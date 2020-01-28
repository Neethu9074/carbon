import theme from 'in-themes';
import React from 'react';

import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import AppdataChartWrapper from 'in-applications/components/AppdataChartWrapper';
import { getChartGranularity } from 'in-applications/metrics';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { percentage } from 'in-services/formatters/number';

export default function Errors({
  timeConfig,
  endpointId,
  applicationId,
  serviceId,
  includeSyntheticCalls,
  boundaryScope,
  cardTitle,
  isSynthetic,
  groupByTag
}) {
  const granularity = getChartGranularity(timeConfig);

  return (
    <div>
      <AppdataChartWrapper
        cardTitle={cardTitle}
        timeConfig={timeConfig}
        y1={{
          renderer: Renderer.bar,
          formatter: percentage,
          detailedFormatting: true,
          labels: ['Erroneous Calls'],
          colors: [theme.lib.colors.failure],
          metricIds: ['errors']
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
                    ? [
                        { name: 'call.is_synthetic', value: 'true' },
                        { name: 'include_synthetic', value: 'true' },
                        { name: 'call.erroneous', value: 'true' }
                      ]
                    : [{ name: 'call.erroneous', value: 'true' }],
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
    </div>
  );
}
