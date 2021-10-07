/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Stack } from '@instana/components';

import { childrenArgsAsPropTypes } from 'in-components/AnalyzeView/StateManagement';
import Configurator from 'in-components/AnalyzeView/Charting/Configurator';
import Chart from 'in-components/AnalyzeView/Charting/Chart';
import { aggregationLabels } from 'in-stores/metric';

export default function Charting(props) {
  const {
    chartedMetricsTemplate,
    chartableMetricCatalog,
    CustomChartFactory,
    chartedMetrics,
    onChartedMetricsChange
  } = props;

  let metricAggregations;

  if (chartedMetricsTemplate != null) {
    metricAggregations =
      chartedMetricsTemplate.metrics?.map(metric => ({
        metricId: metric.metricId,
        aggregations: metric.aggregations
      })) ?? [];
  } else {
    metricAggregations =
      chartableMetricCatalog?.metrics?.map(metric => ({
        metricId: metric.metricId,
        aggregations: metric.aggregations
      })) ?? [];
  }

  const getMetricLabel = metricId => {
    if (chartedMetricsTemplate != null) {
      return chartedMetricsTemplate.metrics?.find(metric => metric.metricId === metricId)?.label;
    } else {
      return chartableMetricCatalog?.find(metric => metric.metricId === metricId)?.label;
    }
  };

  const mapAggregationsToAggregationSelectorOptions = currentMetricConfig => {
    return metricAggregations
      ?.find(agg => agg.metricId === currentMetricConfig.metricId)
      ?.aggregations?.map(agg => ({ value: agg, label: aggregationLabels[agg] }))
      ?.sort((agg1, agg2) => agg1.label.localeCompare(agg2.label));
  };

  return (
    <>
      <Configurator {...props} />
      {chartedMetrics?.length > 0 && (
        <Stack direction="horizontal" gap="none">
          {chartedMetrics.map(metricConfig => {
            const chartProps = {
              ...props,
              title: chartedMetricsTemplate?.metrics?.length > 1 && getMetricLabel(metricConfig.metricId),
              showAggregationSelector:
                metricAggregations?.find(agg => agg.metricId === metricConfig.metricId)?.aggregations?.length > 1,
              onAggregationChange: change => {
                let changedMetrics = {
                  metrics: chartedMetrics?.map(metric => {
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
