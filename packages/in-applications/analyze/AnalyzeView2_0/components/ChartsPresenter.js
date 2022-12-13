/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import LatencyDistributionChart from 'in-applications/analyze/components/ChartingPresenter/LatencyDistributionChart';
import { EMPTY_EXPRESSION, toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { ua2ChartChangedTracker, ua2ChartRemovedTracker } from 'in-applications/tracker';
import { metricRenderers } from 'in-applications/analyze/AnalyzeView2_0/metrics';
import { LESS_THAN } from 'in-components/QueryBuilder/tagFilter/operators';
import Chart from 'in-components/AnalyzeView/Charting/Chart';
import Charting from 'in-components/AnalyzeView/Charting';
import Sections from 'in-components/workspace/Sections';
import theme from 'in-themes';

import locals from './ChartsPresenter.mless';

const erroneousMetricIds = ['errors', 'erroneousCalls'];

function isErroneousMetric(metricConfig) {
  return erroneousMetricIds.includes(metricConfig.metricId);
}

function isErroneousCallsRateMetric(metricConfig) {
  return metricConfig.metricId === 'errors';
}

function isLatencyDistributionChart(metricConfig) {
  return metricConfig.metricId === 'latency' && metricConfig.aggregationId === 'DISTRIBUTION';
}

function getGroupedErroneousCallsRateConfig(metricConfig) {
  return {
    ...metricConfig,
    rendererId: 'line'
  };
}

const truncateTagFilterValue = value => {
  return value.slice(0, 512);
};

const validateTagFilterValue = metricConfiguration => {
  metricConfiguration?.tagFilterExpression?.elements?.forEach(element => {
    if (element?.value?.length > 512) {
      element.value = truncateTagFilterValue(element?.value);
    }
    if (element.name === 'call.latency' && element.value === 0) {
      element.value = 1;
      element.operator = LESS_THAN;
    }
  });
};

export function ChartsPresenter(props) {
  const {
    hiddenCalls,
    groupedViewConfiguration,
    chartedMetrics,
    dataSource,
    isGrouped,
    chartableDataSeries,
    fastQueryModeEnabled
  } = props;

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
        mapMetricConfiguration={(metricConfiguration, { dataSource }) => {
          validateTagFilterValue(metricConfiguration);
          return {
            ...metricConfiguration,
            tagFilterExpression: metricConfiguration.tagFilterExpression,
            dataSource,
            queryPrecision: fastQueryModeEnabled ? 'APPROXIMATE' : 'FULL',
            ...hiddenCalls
          };
        }}
        forceLoadingIndicator={isGrouped && chartableDataSeries == null}
        disableClose={false}
        hideRenderer
        tracking={{
          onChartChanged: ({ templateId, metricId, aggregationId }) =>
            ua2ChartChangedTracker({
              dataSource,
              template: templateId,
              metric: metricId,
              aggregation: aggregationId
            }),
          onChartRemoved: ua2ChartRemovedTracker
        }}
        CustomChartFactory={({ metricConfig, chartProps }) => {
          if (isLatencyDistributionChart(metricConfig)) {
            return (
              <div key={`${metricConfig.metricId}${metricConfig.aggregationId}`} className={locals.latencyDistribution}>
                <LatencyDistributionChart
                  {...chartProps}
                  title={metricConfig.metricId}
                  aggregation={metricConfig.aggregationId}
                  tagFilterExpression={toBackendQueryModel(chartProps.facetsAsTagFilterExpression) ?? EMPTY_EXPRESSION}
                  updateFilter={chartProps.onFacetedSearchSelectionChange}
                  chartedMetrics={[metricConfig]}
                  showHeader
                />
              </div>
            );
          } else if (isErroneousMetric(metricConfig)) {
            let metricConfiguration = metricConfig;
            if (chartProps.isGrouped && isErroneousCallsRateMetric(metricConfig)) {
              metricConfiguration = getGroupedErroneousCallsRateConfig(metricConfig);
            }
            return (
              <Chart
                {...chartProps}
                getCustomChartColor={() => !chartProps.isGrouped && [theme.lib.colors.failure]}
                key={`${metricConfig.metricId}${metricConfig.aggregationId}`}
                chartedMetrics={[metricConfiguration]}
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
