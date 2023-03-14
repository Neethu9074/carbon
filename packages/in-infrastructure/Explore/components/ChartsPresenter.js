/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

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
    metricCatalogInit,
    onChartedMetricChange,
    isGrouped,
    tagFilterExpression,
    type,
    setUrl
  } = props;

  getAggregations();

  const [chartMetricCatalog, setMetricCatalog] = useState({ ...metricCatalogInit, type: '' });

  if (!metricCatalogInit?.progress?.loading && chartMetricCatalog['type'] !== type) {
    setMetricCatalog({ ...metricCatalogInit, type: type });
  }

  const options = getOptions(chartMetricCatalog, metricMetadatas);

  if (!chartedMetrics.length && !metricMetadatas.progress?.loading && Object.keys(options)[0]?.length) {
    if (Object.keys(metricMetadatas.data).length > 0) {
      setUrl({
        chartedMetrics: [
          {
            metricId: Object.keys(metricMetadatas.data)[0],
            aggregationId: 'MEAN',
            rendererId: 'line'
          }
        ]
      });
    } else if (type === chartMetricCatalog.type) {
      const metricLevel = Object.keys(options)[0];
      if (metricLevel?.length) {
        const metric = options[metricLevel][0];
        setUrl({
          chartedMetrics: [
            {
              metricId: metric.metricId,
              aggregationId: 'MEAN',
              rendererId: 'line'
            }
          ]
        });
      }
    }
  }

  return (
    <Sections className={locals.chartWrapper}>
      <Charting
        {...props}
        chartedMetrics={chartedMetrics?.map(chartedMetric => ({
          ...chartedMetric,
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
        chartableMetricCatalog={getChartableMetricCatalog(chartMetricCatalog, metricMetadatas).metrics}
        processedOptions={options}
        onChartedMetricsChange={chartedMetric => {
          onChartedMetricChange(chartedMetric);
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

function getOptions(metricCatalogInit, metricMetadatas) {
  let result = {};
  if (!metricCatalogInit?.progress?.loading) {
    const oneLevelMetricType = Object.keys(metricCatalogInit?.data?.metrics);
    if (
      oneLevelMetricType.length === 1 &&
      metricCatalogInit?.data?.metrics[oneLevelMetricType[0]]?.METRIC &&
      Object.keys(metricCatalogInit?.data?.metrics[oneLevelMetricType[0]]?.METRIC).length > 0
    ) {
      const aggr = getAggregations();
      let optionsArr = [];

      metricCatalogInit?.data?.tree?.forEach(t => {
        let formatterName = getFormatterName(metricMetadatas, t.name);
        optionsArr.push({
          metricId: t.name,
          label: t.label,
          description: t.description,
          aggregations: aggr,
          formatter: formatterName
        });
        result['metrics'] = optionsArr;
      });
    } else {
      const aggr = getAggregations();
      metricCatalogInit?.data?.tree?.forEach(t => {
        let optionsArr = [];

        t.children?.forEach(m => {
          let formatterName = getFormatterName(metricMetadatas, m.name);
          optionsArr.push({
            metricId: m.name,
            label: m.label,
            description: m.description,
            aggregations: aggr,
            groupLabel: t.label,
            formatter: formatterName
          });
        });
        result['_' + t.label] = optionsArr;
      });
    }
  }
  return result;
}

function getAggregations() {
  let result = [];
  Object.keys(aggregationLabels).forEach(k =>
    result.push({
      id: k,
      label: aggregationLabels[k],
      renderers: [{ id: 'line', label: 'Line', renderer: {} }]
    })
  );

  return result;
}

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
