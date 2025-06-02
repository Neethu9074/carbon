/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useEffect, useState } from 'react';

import { Stack } from '@instana/components';

import { childrenArgsAsPropTypes } from 'in-components/AnalyzeView/StateManagement';
import Configurator from 'in-components/AnalyzeView/Charting/Configurator';
import { dataSourceConstants } from 'in-applications/analyze/metrics';
import Chart from 'in-components/AnalyzeView/Charting/Chart';
import { aggregationLabels } from 'in-stores/metric';

function isCallOverviewTemplate(template) {
  return template.templateId === 'calls.overview';
}
const metricCatalogSupportedChartableMetrics = {
  calls: dataSourceConstants.calls.metricCatalogSupportedChartableMetrics,
  traces: dataSourceConstants.calls.metricCatalogSupportedChartableMetrics,
  subtraces: dataSourceConstants.subtraces.metricCatalogSupportedChartableMetrics
};
function isSupportedAggregation(metricId, aggregation, dataSource) {
  const supportedAggregations = metricCatalogSupportedChartableMetrics[dataSource][metricId];
  return supportedAggregations.includes(aggregation);
}

export default function Charting(props) {
  const {
    chartedMetricsTemplate,
    chartableMetricCatalog,
    CustomChartFactory,
    chartedMetrics,
    onChartedMetricsChange,
    dataSource
  } = props;

  let metricAggregations;
  const [cachedMetrics, setCachedMetrics] = useState([]);
  useEffect(() => {
    if (!(chartedMetrics.length && chartedMetrics[0].secondLevelMetricId == '')) {
      setCachedMetrics(chartedMetrics);
    }
  }, [chartedMetrics]);
  if (chartedMetricsTemplate != null) {
    metricAggregations =
      chartedMetricsTemplate.metrics?.map(metric => ({
        metricId: metric.metricId,
        aggregations: isCallOverviewTemplate(chartedMetricsTemplate)
          ? metric.aggregations.filter(
              agg => agg !== 'DISTRIBUTION' && isSupportedAggregation(metric.metricId, agg, dataSource)
            )
          : metric.aggregations
      })) ?? [];
  } else {
    metricAggregations =
      chartableMetricCatalog?.metrics?.map(metric => ({
        metricId: metric.metricId,
        aggregations: metric.aggregations
      })) ?? [];
  }

  const getMetricLabel = ({ metricId, secondLevelMetricId }) => {
    if (chartedMetricsTemplate != null) {
      return chartedMetricsTemplate.metrics?.find(metric => metric.metricId === metricId)?.label;
    } else {
      if (secondLevelMetricId) {
        const customMetricLabel = chartableMetricCatalog?.find(metric => metricId.startsWith(metric.metricId))?.label;
        return `${customMetricLabel} - ${secondLevelMetricId}`;
      }
      return chartableMetricCatalog?.find(metric => metric.metricId === metricId)?.label;
    }
  };

  const mapAggregationsToAggregationSelectorOptions = currentMetricConfig => {
    return metricAggregations
      ?.find(agg => agg.metricId === currentMetricConfig.metricId)
      ?.aggregations?.map(agg => ({ value: agg, label: aggregationLabels[agg] }))
      ?.sort((agg1, agg2) => agg1.label.localeCompare(agg2.label));
  };

  const getChartTitle = metricConfig => {
    if (metricConfig.label === 'Latency') {
      return `${getMetricLabel(metricConfig)}`;
    }

    return `${getMetricLabel(metricConfig)} (${aggregationLabels[metricConfig.aggregationId]})`;
  };

  return (
    <>
      <Configurator {...props} />
      {cachedMetrics?.length > 0 && (
        <Stack direction="horizontal" gap="none">
          {cachedMetrics.map(metricConfig => {
            const chartProps = {
              ...props,
              title: getChartTitle(metricConfig),
              showAggregationSelector:
                metricAggregations?.find(agg => agg.metricId === metricConfig.metricId)?.aggregations?.length > 1,
              onAggregationChange: change => {
                let changedMetrics = {
                  metrics: cachedMetrics?.map(metric => {
                    if (metric.metricId === metricConfig.metricId) {
                      metric.aggregationId = change;
                    }
                    return metric;
                  })
                };
                if (chartedMetricsTemplate != null) {
                  changedMetrics = {
                    templateId: chartedMetricsTemplate.templateId,
                    ...changedMetrics
                  };
                }
                onChartedMetricsChange([changedMetrics]);
              },
              aggregations: mapAggregationsToAggregationSelectorOptions(metricConfig) ?? []
            };

            return CustomChartFactory ? (
              CustomChartFactory({ metricConfig, chartProps })
            ) : (
              <Chart
                key={`${metricConfig.metricId}${metricConfig.aggregationId}`}
                {...chartProps}
                chartedMetrics={[metricConfig]}
              />
            );
          })}
        </Stack>
      )}
    </>
  );
}

Charting.propTypes = {
  ...Configurator.propTypes,
  ...Chart.propTypes,
  ...childrenArgsAsPropTypes
};
