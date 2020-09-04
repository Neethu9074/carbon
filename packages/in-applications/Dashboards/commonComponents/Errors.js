import theme from 'in-themes';
import React from 'react';

import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { getBlueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
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
  groupByTag,
  renderPostChartContent
}) {
  const granularity = getChartGranularity(timeConfig);
  const errorRateBlueprintConfig = getBlueprintConfig('errorRate');

  return (
    <AppdataChartWrapper
      renderPostChartContent={props =>
        renderPostChartContent({
          ...props,
          alertRules: {
            errorRate: {
              rule: {
                alertType: errorRateBlueprintConfig.type,
                aggregation: errorRateBlueprintConfig.getAggregation(),
                metricName: errorRateBlueprintConfig.getMetricName()
              },
              granularity: 60000
            }
          }
        })
      }
      cardTitle={cardTitle}
      timeConfig={timeConfig}
      y1={{
        renderer: Renderer.bar,
        formatter: percentage,
        detailedFormatting: true,
        labels: ['Erroneous Call Rate'],
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
        metrics: { errors: { metric: 'errors', granularity, aggregation: 'MEAN' } }
      }}
      primaryContextMenuAction="analyze"
      additionalContextMenuButtons={[
        {
          name: 'analyze',
          icon: 'lib_analyze',
          label: 'View in Analyze',
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
                  { metric: 'latency', aggregation: 'MEAN' }
                ],
                focusedMetric: 'errors_MEAN'
              }
            )
        }
      ]}
      withMarkerLanes
    />
  );
}
