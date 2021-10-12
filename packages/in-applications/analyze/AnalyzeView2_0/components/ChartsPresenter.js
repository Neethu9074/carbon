/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import LatencyDistributionChart from 'in-applications/analyze/components/ChartingPresenter/LatencyDistributionChart';
import { EMPTY_EXPRESSION, toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { metricRenderers } from 'in-applications/analyze/AnalyzeView2_0/metrics';
import { ua2ChartChangedTracker } from 'in-applications/tracker';
import Chart from 'in-components/AnalyzeView/Charting/Chart';
import Charting from 'in-components/AnalyzeView/Charting';
import Sections from 'in-components/workspace/Sections';
import theme from 'in-themes';

import locals from './ChartsPresenter.mless';

function isRedMetricsTemplateErroneousChart(chartProps, metricConfig) {
  return chartProps.chartedMetricsTemplate?.templateId === 'red.metrics' && metricConfig.metricId === 'errors';
}

function isLatencyDistributionChart(metricConfig) {
  return metricConfig.metricId === 'latency' && metricConfig.aggregationId === 'DISTRIBUTION';
}

export function ChartsPresenter(props) {
  const { hiddenCalls, groupedViewConfiguration, chartedMetrics, dataSource, isGrouped, chartableDataSeries } = props;

  return (
    <Sections className={locals.chartWrapper}>
      <Charting
        {...props}
        getCustomGroupLabel={groupedViewConfiguration.getCustomGroupLabel}
        chartedMetrics={chartedMetrics?.map(chartedMetric => ({
          ...chartedMetric,
          rendererId: metricRenderers[dataSource][chartedMetric.metricId] ?? 'stackedBar'
        }))}
        unifiedMetricsSource="APPLICATION"
        mapMetricConfiguration={(metricConfiguration, { dataSource }) => ({
          ...metricConfiguration,
          tagFilterExpression: metricConfiguration.tagFilterExpression,
          dataSource,
          ...hiddenCalls
        })}
        forceLoadingIndicator={isGrouped && chartableDataSeries == null}
        disableClose={false}
        hideRenderer
        tracking={{
          onChartChanged: ({ templateId, metricId, aggregationId }) =>
            ua2ChartChangedTracker({ dataSource, template: templateId, metric: metricId, aggregation: aggregationId })
        }}
        CustomChartFactory={({ metricConfig, chartProps }) => {
          if (isLatencyDistributionChart(metricConfig)) {
            return (
              <div key={`${metricConfig.metricId}${metricConfig.aggregationId}`} className={locals.latencyDistribution}>
                <LatencyDistributionChart
                  {...chartProps}
                  tagFilterExpression={toBackendQueryModel(chartProps.facetsAsTagFilterExpression) ?? EMPTY_EXPRESSION}
                  updateFilter={chartProps.onFacetedSearchSelectionChange}
                  chartedMetrics={[metricConfig]}
                />
              </div>
            );
          } else if (isRedMetricsTemplateErroneousChart(chartProps, metricConfig)) {
            return (
              <Chart
                {...chartProps}
                getCustomChartColor={() => !chartProps.isGrouped && [theme.lib.colors.failure]}
                key={`${metricConfig.metricId}${metricConfig.aggregationId}`}
                chartedMetrics={[metricConfig]}
              />
            );
          } else {
            return (
              <Chart
                {...chartProps}
                key={`${metricConfig.metricId}${metricConfig.aggregationId}`}
                chartedMetrics={[metricConfig]}
              />
            );
          }
        }}
      />
    </Sections>
  );
}
