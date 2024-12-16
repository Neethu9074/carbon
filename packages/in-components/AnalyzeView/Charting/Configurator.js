/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import rpt from 'prop-types';
import React from 'react';

import ChartingConfiguratorSection from 'in-components/ChartingConfigurator/ChartingConfiguratorSection';
import GroupedChartingConfigurator from 'in-components/ChartingConfigurator/GroupedChartingConfigurator';
import { userSelectableRenderer } from 'in-custom-dashboards/widgets/Chart/renderer';
import { childrenArgsAsPropTypes } from 'in-components/AnalyzeView/StateManagement';
import { emptyArray } from 'in-services/fixedObjects';
import { aggregationLabels } from 'in-stores/metric';

export default function Configurator({
  onChartedMetricsChange,
  chartedMetrics,
  chartedMetricsTemplate,
  chartedMetricsTemplates,
  chartableMetricCatalog,
  dataSource,
  unifiedMetricsSource,
  disableClose,
  hideRenderer,
  tracking
}) {
  const value = chartedMetricsTemplate ?? chartedMetrics?.[0];

  const options = {
    templates: chartedMetricsTemplates ?? emptyArray,
    metrics:
      chartableMetricCatalog?.map(
        ({
          metricId,
          secondLevelMetricId,
          metricTagSuggestions,
          label,
          description,
          aggregations,
          groupLabel,
          customMetric
        }) => ({
          metricId,
          secondLevelMetricId,
          metricTagSuggestions,
          label,
          description,
          aggregations: aggregations.map(aggregationId => ({
            id: aggregationId,
            label: aggregationLabels[aggregationId],
            renderers: userSelectableRenderer
          })),
          groupLabel,
          customMetric
        })
      ) ?? emptyArray
  };

  return (
    <ChartingConfiguratorSection
      value={value}
      options={options}
      dataSource={dataSource}
      unifiedMetricsSource={unifiedMetricsSource}
      ChartingConfigurator={GroupedChartingConfigurator}
      onChange={metric => {
        if (Array.isArray(metric)) {
          return onChartedMetricsChange(metric);
        }
        return onChartedMetricsChange(metric ? [metric] : []);
      }}
      tracking={tracking}
      hideRenderer={hideRenderer}
      disableClose={disableClose}
    />
  );
}

Configurator.propTypes = {
  ...childrenArgsAsPropTypes,
  tracking: rpt.shape({
    onChartChanged: rpt.func
  })
};
