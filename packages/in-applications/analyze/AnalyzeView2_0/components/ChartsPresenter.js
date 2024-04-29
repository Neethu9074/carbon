/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { themes } from '@instana/design-tokens';

import LatencyDistributionChart from 'in-applications/analyze/components/ChartingPresenter/LatencyDistributionChart';
import { EMPTY_EXPRESSION, toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { ua2ChartChangedTracker, ua2ChartRemovedTracker } from 'in-applications/tracker';
import { metricRenderers } from 'in-applications/analyze/AnalyzeView2_0/metrics';
import Chart from 'in-components/AnalyzeView/Charting/Chart';
import Charting from 'in-components/AnalyzeView/Charting';
import Sections from 'in-components/workspace/Sections';
import { emptyObject } from 'in-services/fixedObjects';

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
  });
};

const transformMetricTagFilterValues = tagFilterExpression => {
  // check if it is a metric filter and if a value is given.
  // This prevents e.g. the value "Tag not present" from being transformed.
  return tagFilterExpression.name === 'call.metric' && tagFilterExpression.value
    ? { ...tagFilterExpression, value: Number(tagFilterExpression.value) }
    : tagFilterExpression;
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
            tagFilterExpression: transformMetricTagFilterValues(metricConfiguration.tagFilterExpression),
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
          onChartRemoved: ua2ChartRemovedTracker(emptyObject)
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
                  chartableDataSeries={chartableDataSeries}
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
                getCustomChartColor={() => !chartProps.isGrouped && [themes.default.ids.color.option.red['500']]}
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
