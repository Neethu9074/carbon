import theme from 'in-themes';
import React from 'react';

import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { getBlueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
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
  const throughputBlueprintConfig = getBlueprintConfig('throughput');
  const errorRateBlueprintConfig = getBlueprintConfig('errorRate');

  return (
    <AppdataChartWrapper
      renderPostChartContent={props =>
        renderPostChartContent({
          ...props,
          alertRules: {
            throughput: {
              rule: {
                alertType: throughputBlueprintConfig.type,
                aggregation: throughputBlueprintConfig.getAggregation(),
                metricName: throughputBlueprintConfig.getMetricName()
              },
              operator: throughputBlueprintConfig.thresholdDefaults.operator,
              granularity: 60000
            },
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
          label: 'View in Analyze',
          getHref$: (highlightedTime, config) =>
            getJumpToAnalyzeHref$(
              { applicationId, serviceId, endpointId },
              {
                timeConfig: highlightedTime,
                boundaryScope,
                groupByTag,
                filters: isSynthetic
                  ? [
                      { name: 'call.is_synthetic', value: 'true' },
                      { name: 'include_synthetic', value: 'true' }
                    ]
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
