/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { addDataSourceToBackendQueryModel } from 'in-websites/analyze/AnalyzeView2_0/util';
import { metricRenderers } from 'in-websites/analyze/AnalyzeView2_0/metrics';
import { useWebsiteTracker } from 'in-websites/tracking/segTracker';
import Chart from 'in-components/AnalyzeView/Charting/Chart';
import Charting from 'in-components/AnalyzeView/Charting';
import Sections from 'in-components/workspace/Sections';
import { carbonAlert } from 'in-themes/chartColors';

import locals from './ChartsPresenter.mless';

const erroneousMetricIds = ['beaconErrorCount', 'beaconErrorRate', 'errors', 'http5xx'];

function isErroneousMetric(metricConfig) {
  return erroneousMetricIds.includes(metricConfig.metricId);
}

export function ChartsPresenter(props) {
  const { ua2ChartChangedTracker } = useWebsiteTracker();
  const { chartedMetrics, dataSource, isGrouped, chartableDataSeries } = props;

  return (
    <Sections className={locals.chartWrapper}>
      <Charting
        {...props}
        chartedMetrics={chartedMetrics?.map(chartedMetric => ({
          ...chartedMetric,
          rendererId: metricRenderers[dataSource][chartedMetric?.metricId] ?? 'stackedBar'
        }))}
        unifiedMetricsSource="WEBSITE"
        mapMetricConfiguration={mapMetricConfiguration}
        forceLoadingIndicator={isGrouped && chartableDataSeries == null}
        disableClose={false}
        hideRenderer
        tracking={{
          onChartChanged: ({ templateId, metricId, aggregationId }) =>
            ua2ChartChangedTracker({ dataSource, template: templateId, metric: metricId, aggregation: aggregationId })
        }}
        CustomChartFactory={({ metricConfig, chartProps }) => {
          if (isErroneousMetric(metricConfig)) {
            return (
              <Chart
                {...chartProps}
                getCustomChartColor={() => !chartProps.isGrouped && [carbonAlert.red60]}
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
