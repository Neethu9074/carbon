/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import rpt from 'prop-types';
import React from 'react';

import ChartingConfiguratorSection from 'in-new-components/ChartingConfigurator/ChartingConfiguratorSection';
import { childrenArgsAsPropTypes } from 'in-new-components/AnalyzeView/StateManagement';
import { userSelectableRenderer } from 'in-custom-dashboards/widgets/Chart/renderer';
import { aggregationLabels } from 'in-stores/metric/metric';
import { emptyArray } from 'in-services/fixedObjects';

export default function Configurator({ onChartedMetricsChange, chartedMetrics, chartableMetricCatalog, tracking }) {
  return (
    <ChartingConfiguratorSection
      value={chartedMetrics?.[0]}
      options={
        chartableMetricCatalog?.map(({ metricId, label, description, aggregations }) => ({
          metricId,
          label,
          description,
          aggregations: aggregations.map(aggregationId => ({
            id: aggregationId,
            label: aggregationLabels[aggregationId],
            renderers: userSelectableRenderer
          }))
        })) || emptyArray
      }
      onChange={metric => onChartedMetricsChange(metric ? [metric] : [])}
      tracking={tracking}
      hideRenderer
      disableClose
    />
  );
}

Configurator.propTypes = {
  ...childrenArgsAsPropTypes,
  tracking: rpt.shape({
    onChartChanged: rpt.func
  })
};
