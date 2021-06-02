/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import rpt from 'prop-types';
import React from 'react';

import { Li } from '@instana/components';

import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { childrenArgsAsPropTypes } from 'in-new-components/AnalyzeView/StateManagement';
import { getUiInternalFormatterName } from 'in-services/formatters/backendFormatter';
import { identity } from 'in-services/util/function';

import locals from './Chart.mless';

export default function Chart({
  isGrouped,
  getCustomGroupLabel,
  getCustomMetricUiFormatterName,
  chartableMetricCatalog,
  chartableDataSeries,
  chartedMetrics,
  backendQueryModel,
  mapMetricConfiguration = identity,
  unifiedMetricsSource,
  dataSource,
  forceLoadingIndicator
}) {
  if (chartedMetrics.length < 1 || !chartableMetricCatalog) {
    return null;
  }

  const { aggregationId, metricId, rendererId } = chartedMetrics[0];

  const metricDescription = chartableMetricCatalog.find(m => m.metricId === metricId);
  if (!metricDescription) {
    return null;
  }

  const chartConfig = {
    y1: {
      formatter: getCustomMetricUiFormatterName?.(metricId) ?? getUiInternalFormatterName(metricDescription.formatter),
      renderer: rendererId,
      metrics: []
    }
  };

  if (isGrouped) {
    const groupLabel = getCustomGroupLabel ?? identity;
    chartConfig.y1.metrics = chartableDataSeries?.map(({ label, formModel }) =>
      mapMetricConfiguration(
        {
          metric: metricId,
          tagFilterExpression: toBackendQueryModel(formModel),
          aggregation: aggregationId,
          label: groupLabel(label),
          source: unifiedMetricsSource
        },
        { dataSource }
      )
    );
  } else {
    chartConfig.y1.metrics.push(
      mapMetricConfiguration(
        {
          metric: metricId,
          tagFilterExpression: backendQueryModel,
          aggregation: aggregationId,
          label: metricDescription.label,
          source: unifiedMetricsSource
        },
        { dataSource }
      )
    );
  }

  return (
    <Li className={locals.chartWrapper} noAlternatingBg>
      <UnifiedMetricsChart renderLegend={false} config={chartConfig} forceLoadingIndicator={forceLoadingIndicator} />
    </Li>
  );
}

Chart.propTypes = {
  ...childrenArgsAsPropTypes,
  mapMetricConfiguration: rpt.func,
  unifiedMetricsSource: rpt.string.isRequired,
  forceLoadingIndicator: rpt.bool,
  // Allows to customize group labels
  getCustomGroupLabel: rpt.func,
  getCustomMetricUiFormatterName: rpt.func
};
