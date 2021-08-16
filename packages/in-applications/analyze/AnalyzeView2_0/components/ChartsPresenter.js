/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import LatencyDistributionChart from 'in-applications/analyze/components/ChartingPresenter/LatencyDistributionChart';
import { EMPTY_EXPRESSION, toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { metricRenderers } from 'in-applications/analyze/AnalyzeView2_0/metrics';
import { ua2ChartChangedTracker } from 'in-applications/tracker';
import Charting from 'in-components/AnalyzeView/Charting';
import Sections from 'in-components/workspace/Sections';

import locals from './ChartsPresenter.mless';

export function ChartsPresenter(props) {
  const {
    hiddenCalls,
    groupedViewConfiguration,
    chartedMetrics,
    dataSource,
    isGrouped,
    chartableDataSeries,
    facets,
    facetsAsTagFilterExpression,
    formModel,
    facetedSearchItems,
    onFacetedSearchSelectionChange
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
          onChartChanged: ({ metricId, aggregationId }) =>
            ua2ChartChangedTracker({ dataSource, metric: metricId, aggregation: aggregationId })
        }}
        CustomChart={
          chartedMetrics?.[0]?.metricId === 'latency' &&
          chartedMetrics?.[0]?.aggregationId === 'DISTRIBUTION' &&
          (() => (
            <div className={locals.latencyDistribution}>
              <LatencyDistributionChart
                dataSource={dataSource}
                tagFilterExpression={toBackendQueryModel(facetsAsTagFilterExpression) ?? EMPTY_EXPRESSION}
                hiddenCalls={hiddenCalls}
                facets={facets}
                formModel={formModel}
                facetedSearchItems={facetedSearchItems}
                updateFilter={onFacetedSearchSelectionChange}
              />
            </div>
          ))
        }
      />
    </Sections>
  );
}
