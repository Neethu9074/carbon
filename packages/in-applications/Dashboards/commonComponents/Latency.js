import React from 'react';

import { millis, latencyFixed, meanLatencyFixed } from 'in-services/formatters/number';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { getBlueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import AppdataChartWrapper from 'in-applications/components/AppdataChartWrapper';
import { getChartGranularity } from 'in-applications/metrics';
import Renderer from 'in-components/Chart/renderer/Renderer';

export default function Latency({
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
  const slownessBlueprintConfig = getBlueprintConfig('slowness');
  const aggregations = ['P50', 'P90', 'P95', 'P99', 'MAX', 'MEAN'];
  const alertRules = {};

  for (const aggregation of aggregations) {
    alertRules[`slowness_${aggregation}`] = {
      rule: {
        alertType: slownessBlueprintConfig.type,
        aggregation,
        metricName: slownessBlueprintConfig.getMetricName()
      },
      granularity: 60000
    };
  }

  return (
    <AppdataChartWrapper
      renderPostChartContent={props =>
        renderPostChartContent({
          alertRules,
          ...props
        })
      }
      cardTitle={cardTitle}
      timeConfig={timeConfig}
      reverseTooltipOrder
      shareMaxAxisDomain
      y1={{
        renderer: Renderer.integral,
        formatter: millis.forcedFixedCompact,
        tooltipFormatter: latencyFixed.compact,
        calculateStackDifferences: true,
        labels: ['50th', '90th', '95th', '99th', 'Max'],
        defaultDisabledMetrics: ['durationMax'],
        metricIds: ['duration50th', 'duration90th', 'duration95th', 'duration99th', 'durationMax']
      }}
      y2={{
        renderer: Renderer.line,
        formatter: millis.forcedFixedCompact,
        tooltipFormatter: meanLatencyFixed.compact,
        labels: ['Mean'],
        defaultDisabledMetrics: ['durationAvg'],
        metricIds: ['durationAvg']
      }}
      metricsConfiguration={{
        filter: {
          timeConfig,
          application: applicationId,
          service: serviceId,
          endpoint: endpointId,
          applicationBoundaryScope: boundaryScope,
          includeSyntheticCalls
        },
        metrics: {
          duration50th: { metric: 'latency', granularity, aggregation: 'P50' },
          duration90th: { metric: 'latency', granularity, aggregation: 'P90' },
          duration95th: { metric: 'latency', granularity, aggregation: 'P95' },
          duration99th: { metric: 'latency', granularity, aggregation: 'P99' },
          durationMax: { metric: 'latency', granularity, aggregation: 'MAX' },
          durationAvg: { metric: 'latency', granularity, aggregation: 'MEAN' }
        }
      }}
      primaryContextMenuAction="analyze"
      additionalContextMenuButtons={[
        {
          name: 'analyze',
          icon: 'lib_analyze',
          label: 'View in Analyze',
          getHref$: (highlightedTime, metricsToAdd) =>
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
                metrics: mapMetricsToAdd(metricsToAdd.renderedMetrics),
                focusedMetric: focusBasedOnMetrics(metricsToAdd.renderedMetrics)
              }
            )
        }
      ]}
    />
  );
}

function mapMetricsToAdd(metrics) {
  const metricsForLink = [];
  metrics.map(metric => {
    metricsForLink.push({ metric: 'latency', aggregation: aggregation(metric) });
  });
  return metricsForLink;
}
function focusBasedOnMetrics(metrics) {
  const metricsList = mapMetricsToAdd(metrics);
  if (metricsList.length > 1 && metricsList[0].aggregation === 'P99' && metricsList[1].aggregation === 'MAX') {
    return `latency_MAX`;
  }
  return `latency_${metricsList[0].aggregation}`;
}

function aggregation(metric) {
  switch (metric) {
    case 'duration50th':
      return 'P50';
    case 'duration90th':
      return 'P90';
    case 'duration95th':
      return 'P95';
    case 'duration99th':
      return 'P99';
    case 'durationMax':
      return 'MAX';
    case 'durationAvg':
      return 'MEAN';
  }
}
