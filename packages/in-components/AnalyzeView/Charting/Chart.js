/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';
import rpt from 'prop-types';

import { Stack } from '@instana/components';

import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import MultiLineToolTipIcon from 'in-components/MultiLineToolTipIcon/MultiLineToolTipIcon';
import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import AggregationSelector from 'in-components/AnalyzeView/Charting/AggregationSelector';
import { getUiInternalFormatterName } from 'in-services/formatters/backendFormatter';
import { childrenArgsAsPropTypes } from 'in-components/AnalyzeView/StateManagement';
import { identity } from 'in-services/util/function';
import { t } from 'in-i18n';

import locals from './Chart.mless';

export default function Chart({
  title,
  isGrouped,
  getCustomChartColor,
  getCustomGroupLabel,
  getCustomMetricUiFormatterName,
  chartableMetricCatalog,
  chartableDataSeries,
  chartedMetrics,
  backendQueryModelWithFacets,
  mapMetricConfiguration = identity,
  unifiedMetricsSource,
  dataSource,
  forceLoadingIndicator,
  showAggregationSelector,
  onAggregationChange,
  aggregations,
  fastQueryModeEnabled,
  groupBy
}) {
  const [hasApproximateData, setApproximateData] = useState(false);

  if (chartedMetrics.length < 1 || !chartableMetricCatalog) {
    return null;
  }

  const { aggregationId, metricId, rendererId, crossSeriesAggregation } = chartedMetrics[0];

  const metricDescription = chartableMetricCatalog.find(
    m => m.metricId === metricId || (m.customMetric && metricId.startsWith(m.metricId))
  );
  if (!metricDescription) {
    return null;
  }

  const chartConfig = {
    y1: {
      formatter:
        getCustomMetricUiFormatterName?.(metricId, aggregationId) ??
        getUiInternalFormatterName(metricDescription.formatter),
      renderer: rendererId,
      metrics: [],
      colors: getCustomChartColor?.()
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
          label: groupLabel(label, groupBy.groupbyTag),
          source: unifiedMetricsSource,
          crossSeriesAggregation: crossSeriesAggregation
        },
        { dataSource }
      )
    );
  } else {
    chartConfig.y1.metrics.push(
      mapMetricConfiguration(
        {
          metric: metricId,
          tagFilterExpression: backendQueryModelWithFacets,
          aggregation: aggregationId,
          label: metricDescription.label,
          source: unifiedMetricsSource,
          crossSeriesAggregation: crossSeriesAggregation
        },
        { dataSource }
      )
    );
  }

  const header = (title || showAggregationSelector) && (
    <div className={locals.header}>
      <Stack direction="horizontal" distribution="spaceBetween" align="center">
        {title && (
          <div className={locals.titleWrapper}>
            <span className={locals.title}>{title}</span>
            {hasApproximateData && (
              <MultiLineToolTipIcon
                lines={[
                  fastQueryModeEnabled
                    ? t('in-components:approximateDataIndicator.dataRetentionOrFastQueryMode')
                    : t('in-components:approximateDataIndicator.dataRetention')
                ]}
                withMargin
                iconSize={'xs'}
              />
            )}
          </div>
        )}
        {showAggregationSelector && (
          <AggregationSelector
            selectedAggregation={aggregationId}
            aggregations={aggregations}
            onChange={onAggregationChange}
          />
        )}
      </Stack>
    </div>
  );

  return (
    <div className={locals.chartWrapper}>
      {header}
      <UnifiedMetricsChart
        renderLegend={false}
        config={chartConfig}
        forceLoadingIndicator={forceLoadingIndicator}
        onApproximateDataChange={setApproximateData}
      />
    </div>
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
