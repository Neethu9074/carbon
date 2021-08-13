/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { addDataSourceToBackendQueryModel } from 'in-websites/analyze/AnalyzeView2_0/util';
import { metricRenderers } from 'in-websites/analyze/AnalyzeView2_0/metrics';
import { ua2ChartChangedTracker } from 'in-websites/tracker';
import Charting from 'in-components/AnalyzeView/Charting';
import Sections from 'in-components/workspace/Sections';

import locals from './ChartsPresenter.mless';

export function ChartsPresenter(props) {
  const { chartedMetrics, dataSource, isGrouped, chartableDataSeries } = props;

  return (
    <Sections className={locals.chartWrapper}>
      <Charting
        {...props}
        chartedMetrics={chartedMetrics.map(chartedMetric => ({
          ...chartedMetric,
          rendererId: metricRenderers[dataSource][chartedMetric.metricId] ?? 'stackedBar'
        }))}
        unifiedMetricsSource="WEBSITE"
        mapMetricConfiguration={mapMetricConfiguration}
        forceLoadingIndicator={isGrouped && chartableDataSeries == null}
        tracking={{
          onChartChanged: ({ metricId, aggregationId }) =>
            ua2ChartChangedTracker({ dataSource, metric: metricId, aggregation: aggregationId })
        }}
      />
    </Sections>
  );
}

function mapMetricConfiguration(metricConfiguration, { dataSource }) {
  return {
    ...metricConfiguration,
    tagFilterExpression: addDataSourceToBackendQueryModel({
      backendQueryModel: metricConfiguration.tagFilterExpression,
      dataSource
    }),
    beaconType: dataSource
  };
}
