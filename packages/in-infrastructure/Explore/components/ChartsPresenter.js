/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useMemo } from 'react';

import { aggregationLabels } from 'in-stores/metric/beeInstant';
import Charting from 'in-components/AnalyzeView/Charting';
import Sections from 'in-components/workspace/Sections';

import locals from './ChartsPresenter.mless';

export function ChartsPresenter(props) {
  const {
    chartedMetrics,
    metricMetadatas,
    metricCatalog,
    onChartedMetricsChange,
    isGrouped,
    isValid,
    isLoading,
    tagFilterExpression,
    type,
    tracking
  } = props;

  const dataSource = 'infrastructure';

  const { onChartChanged } = tracking;

  const chartableMetricCatalog = useMemo(
    () => getChartableMetricCatalog(metricCatalog, metricMetadatas),
    [metricCatalog, metricMetadatas]
  );

  return (
    <Sections className={locals.chartWrapper}>
      <Charting
        isGrouped={isGrouped}
        isValid={isValid}
        dataSource={dataSource}
        isLoading={isLoading}
        chartedMetrics={chartedMetrics
          ?.filter(chartedMetric =>
            chartableMetricCatalog.find(catalogMetric => chartedMetric.metric === catalogMetric.metricId)
          )
          .map(chartedMetric => ({
            metricId: chartedMetric.metric ?? chartedMetric.metricId,
            aggregationId: chartedMetric.aggregation ?? chartedMetric.aggregationId,
            rendererId: 'line',
            crossSeriesAggregation: chartedMetric.crossSeriesAggregation
          }))}
        unifiedMetricsSource="INFRASTRUCTURE_METRICS"
        forceLoadingIndicator={false}
        disableClose={false}
        hideRenderer
        tracking={{
          onChartChanged: ({ templateId, metricId, aggregationId }) => {
            onChartChanged({ dataSource, template: templateId, metric: metricId, aggregation: aggregationId });
          }
        }}
        mapMetricConfiguration={(metricConfiguration, { dataSource }) => {
          if (metricConfiguration.metric === 'count') {
            metricConfiguration[`crossSeriesAggregation`] = 'DISTINCT_COUNT';
            metricConfiguration[`allowedCrossSeriesAggregations`] = ['DISTINCT_COUNT'];
          }

          return {
            ...metricConfiguration,
            tagFilterExpression: metricConfiguration.tagFilterExpression,
            dataSource,
            resultType: 'TIME_SERIES',
            source: 'INFRASTRUCTURE_METRICS',
            type: type
          };
        }}
        backendQueryModelWithFacets={tagFilterExpression}
        chartableMetricCatalog={chartableMetricCatalog}
        onChartedMetricsChange={metrics => {
          onChartedMetricsChange(
            metrics.map(metric => ({ metric: metric.metricId, aggregation: metric.aggregationId }))
          );
        }}
        {...defaultProps}
      />
    </Sections>
  );
}

function getFormatter(metricMetadatas, name) {
  const formatter = metricMetadatas.data ? metricMetadatas.data[name]?.formatter : undefined;
  let formatterName =
    formatter?.detailed?.__instanaFormatterType !== undefined && formatter.detailed.__instanaFormatterType.size > 0
      ? Array.from(formatter?.detailed.__instanaFormatterType)[0]
      : undefined;
  if (formatterName === undefined) {
    formatterName =
      formatter?.__instanaFormatterType !== undefined && formatter.__instanaFormatterType.size > 0
        ? Array.from(formatter?.__instanaFormatterType)[0]
        : undefined;
  }
  return formatterName;
}

function getChartableMetricCatalog(metricsCatalog, metricMetadatas) {
  let result = [];
  addMetrics(metricsCatalog.data?.tree ?? [], [], metricMetadatas, result);
  return result;
}

function addMetrics(metrics, path, metricMetadatas, result) {
  metrics.forEach(m => {
    if (m.type === 'METRIC') {
      let formatter = getFormatter(metricMetadatas, m.name);
      result.push({
        metricId: m.name,
        label: m.label,
        description: m.description,
        aggregations,
        formatter,
        groupLabel: path.join(' ')
      });
    } else {
      addMetrics(m.children, [...path, m.label], metricMetadatas, result);
    }
  });
}

const aggregations = Object.keys(aggregationLabels);

const defaultProps = {
  refreshFixatedTimeConfig: () => {},
  setDetailId: () => {},
  groupedViewConfiguration: { defaultOrderBy: '', defaultOrderDirection: 'ASC' },
  ungroupedViewPropType: { defaultOrderBy: '', defaultOrderDirection: 'ASC' },
  getOrderByGroupId: () => {},
  ungroupedViewConfiguration: { defaultOrderBy: '', defaultOrderDirection: 'ASC' },
  formModel: [],
  onFormModelChange: () => {},
  getHrefWithAdditionalTagFilter: () => {},
  getHrefWithTagFilterExpression: () => {},
  onGroupByChange: () => {},
  getHrefToUngroupedView: () => {},
  getHrefToGroupedView: () => {},
  orderBy: { by: '', direction: 'ASC' },
  onOrderByChange: () => {},
  onSelectableFieldsChange: () => {},
  onChartableDataSeriesChange: () => {},
  getHrefToDetailId: () => {}
};
