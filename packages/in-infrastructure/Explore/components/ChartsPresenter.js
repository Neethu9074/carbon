/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useMemo } from 'react';

import { aggregationLabels } from 'in-stores/metric/beeInstant';
import { ua2ChartChangedTracker } from 'in-websites/tracker';
import Charting from 'in-components/AnalyzeView/Charting';
import Sections from 'in-components/workspace/Sections';

import locals from './ChartsPresenter.mless';

export function ChartsPresenter(props) {
  const {
    chartedMetrics,
    metricMetadatas,
    dataSource,
    chartableDataSeries,
    metricCatalog,
    onChartedMetricsChange,
    isGrouped,
    isValid,
    isLoading,
    tagFilterExpression,
    type
  } = props;

  const options = useMemo(() => getOptions(metricCatalog, metricMetadatas), [metricCatalog, metricMetadatas]);

  return (
    <Sections className={locals.chartWrapper}>
      <Charting
        isGrouped={isGrouped}
        isValid={isValid}
        dataSource={dataSource}
        isLoading={isLoading}
        chartedMetrics={chartedMetrics?.map(chartedMetric => ({
          metricId: chartedMetric.metric ?? chartedMetric.metricId,
          aggregationId: chartedMetric.aggregation ?? chartedMetric.aggregationId,
          rendererId: 'line'
        }))}
        unifiedMetricsSource="INFRASTRUCTURE_METRICS"
        forceLoadingIndicator={isGrouped && chartableDataSeries == null}
        disableClose={false}
        hideRenderer
        tracking={{
          onChartChanged: ({ templateId, metricId, aggregationId }) =>
            ua2ChartChangedTracker({ dataSource, template: templateId, metric: metricId, aggregation: aggregationId })
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
        chartableMetricCatalog={getChartableMetricCatalog(metricCatalog, metricMetadatas).metrics}
        processedOptions={options}
        onChartedMetricsChange={metrics => {
          onChartedMetricsChange(metrics.map(metric => ({ metric: metric.metricId, aggregation: metric.aggregationId })));
        }}
        {...defaultProps}
      />
    </Sections>
  );
}

function getFormatterName(metricMetadatas, name) {
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

  if (!metricsCatalog.progress.loading) {
    metricsCatalog.data?.tree?.forEach(t => {
      const oneLevelMetricType = Object.keys(metricsCatalog.data?.metrics);
      if (
        oneLevelMetricType.length === 1 &&
        metricsCatalog.data?.metrics[oneLevelMetricType[0]]?.METRIC &&
        Object.keys(metricsCatalog.data?.metrics[oneLevelMetricType[0]]?.METRIC).length > 0
      ) {
        let formatterName = getFormatterName(metricMetadatas, t.name);
        result.push({
          metricId: t.name,
          label: t.label,
          description: t.description,
          aggregations: ['MEAN'],
          formatter: formatterName
        });
      } else {
        t.children?.forEach(m => {
          let formatterName = getFormatterName(metricMetadatas, m.name);
          result.push({
            metricId: m.name,
            label: m.label,
            description: m.description,
            aggregations: ['MEAN'],
            formatter: formatterName
          });
        });
      }
    });
  }
  return { metrics: result };
}

function getOptions(metricCatalog, metricMetadatas) {
  let result = {};
  if (!metricCatalog?.progress?.loading) {
    const oneLevelMetricType = Object.keys(metricCatalog?.data?.metrics);
    // TODO: fix usage of `metricCatalog.data.metrics` - always use `...tree`
    if (
      oneLevelMetricType.length === 1 &&
      metricCatalog?.data?.metrics[oneLevelMetricType[0]]?.METRIC &&
      Object.keys(metricCatalog?.data?.metrics[oneLevelMetricType[0]]?.METRIC).length > 0
    ) {
      let optionsArr = [];

      // TODO: get rid of usage of metricMetadatas
      metricCatalog?.data?.tree?.forEach(t => {
        let formatterName = getFormatterName(metricMetadatas, t.name);
        optionsArr.push({
          metricId: t.name,
          label: t.label,
          description: t.description,
          aggregations,
          formatter: formatterName
        });
        result['metrics'] = optionsArr;
      });
    } else {
      metricCatalog?.data?.tree?.forEach(t => {
        let optionsArr = [];

        t.children?.forEach(m => {
          let formatterName = getFormatterName(metricMetadatas, m.name);
          optionsArr.push({
            metricId: m.name,
            label: m.label,
            description: m.description,
            aggregations,
            groupLabel: t.label,
            formatter: formatterName
          });
        });
        // TODO: get rid of magic _
        result['_' + t.label] = optionsArr;
      });
    }
  }
  return result;
}

const aggregations = Object.keys(aggregationLabels).map(k => ({
  id: k,
  label: aggregationLabels[k],
  renderers: [{ id: 'line', label: 'Line', renderer: {} }]
}));

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
