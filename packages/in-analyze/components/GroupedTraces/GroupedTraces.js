import { compose, withProps, withState } from 'recompose';
import React from 'react';

import { serializeMetrics, deserializeMetrics, metrics as metricsMatrixParameter } from 'in-websites/navigation/matrix';
import ApplicationGroupMetricsChart from 'in-analyze/components/ApplicationGroupMetricsChart';
import TraceGroupsTable from 'in-analyze/components/GroupedTraces/TraceGroupsTable';
import { availableMetrics, defaultMetrics } from 'in-applications/analyze/metrics';
import GroupingTableHeader from 'in-analyze/components/GroupingTableHeader';
import getTraceGroups from 'in-subscription/application/getTraceGroups';
import getCallGroups from 'in-subscription/application/getCallGroups';
import AnalyzeWorkspace from 'in-analyze/components/AnalyzeWorkspace';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import MetricSelector from 'in-analyze/components/MetricSelector';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import { getChartGranularity } from 'in-applications/metrics';
import { entityTypes } from 'in-analyze/applicationFilter';
import { metricChangedTracker } from 'in-analyze/tracker';
import { analyze } from 'in-analyze/navigation/paths';
import cursorPaginated from 'in-hoc/cursorPaginated';
import theme from 'in-themes';

const defaultCountMetric = dataSource => {
  return {
    metric: dataSource,
    aggregation: 'SUM'
  };
};

const defaultOrder = 'count';

export default compose(
  withUrlDependingState({
    getPathSegment: () => analyze,
    getMatrixPrefix: () => 'groups.',
    boundKeys: [metricsMatrixParameter, 'orderBy', 'orderDirection', 'showGraph'],
    getInitialState: () => ({
      [metricsMatrixParameter]: defaultMetrics,
      orderBy: defaultOrder,
      orderDirection: 'DESC',
      previewEnabled: false
    }),
    getParsedUrlValues: urlValues => ({
      [metricsMatrixParameter]: deserializeMetrics(urlValues[metricsMatrixParameter]),
      orderBy: urlValues.orderBy,
      orderDirection: urlValues.orderDirection,
      showGraph: Boolean(urlValues.showGraph),
      previewEnabled: Boolean(urlValues.previewEnabled)
    }),
    getSerializedUrlValues: props => ({
      [metricsMatrixParameter]: serializeMetrics(props[metricsMatrixParameter]),
      orderBy: props.orderBy,
      orderDirection: props.orderDirection,
      previewEnabled: props.previewEnabled
    }),
    reducerName: 'onChange'
  }),
  withProps(({ dataSource, onChange, metrics, orderBy, orderDirection, showGraph }) => ({
    availableMetrics: availableMetrics,
    onChangeOrder: onChange,
    showGraph: showGraph,
    openMetricSelector: () => {
      setActiveDialog(
        <MetricSelector
          title="Select Metrics"
          help="Select which metrics should be available as columns within the table. It also defines which metrics could be viewed as graphs."
          availableMetrics={availableMetrics}
          selectedMetrics={metrics}
          maximumNumberOfMetrics={5}
          isGroupedView
          onSave={metrics => {
            const orderByMetricStillExists = metrics.reduce(
              (agg, { metric, aggregation }) => agg || orderBy === `${metric}_${aggregation}_Agg`,
              false
            );
            metricChangedTracker({ dataSource, metrics: JSON.stringify(metrics) });
            onChange({
              [metricsMatrixParameter]: metrics,
              orderBy: orderByMetricStillExists ? orderBy : defaultOrder,
              orderDirection: orderByMetricStillExists ? orderDirection : 'DESC'
            });
          }}
        />
      );
    }
  })),
  withState('isChartSectionExpanded', 'setIsChartSectionExpanded', props => props.showGraph),
  cursorPaginated({
    getResettingProps: () => [
      'filters',
      'orderBy',
      'orderDirection',
      'isChartSectionExpanded',
      'metrics',
      'previewEnabled'
    ],
    get: ({
      dataSource,
      tagFiltersForSubscription,
      cursor,
      filters,
      orderBy,
      orderDirection,
      isChartSectionExpanded,
      metrics,
      previewEnabled = false
    }) => {
      metrics = metrics.concat(defaultCountMetric(dataSource));
      const timeConfig = filters.timeConfig;
      const granularity = getChartGranularity(timeConfig);
      const metricsForQuery = metrics.reduce((agg, { metric, aggregation }) => {
        agg[`${metric}_${aggregation}_Agg`] = {
          metric,
          aggregation
        };

        if (isChartSectionExpanded) {
          agg[`${metric}_${aggregation}`] = {
            metric,
            aggregation,
            granularity
          };
        }

        return agg;
      }, {});

      const getGroupsData = dataSource === 'traces' ? getTraceGroups : getCallGroups;
      return getGroupsData({
        pagination: {
          cursor,
          retrievalSize: 20
        },
        order: {
          by: getOrderByForQuery(orderBy, dataSource, metricsForQuery),
          direction: orderDirection
        },
        filter: {
          timeConfig
        },
        metrics: metricsForQuery,
        tagFilters: tagFiltersForSubscription,
        group: {
          groupbyTag: filters.group ? filters.group.name : null,
          groupbyTagSecondLevelKey: filters.group ? filters.group.value : '',
          groupbyTagEntity: filters.group ? filters.group.entity : entityTypes.NOT_APPLICABLE
        },
        queryPrecision: previewEnabled ? 'APPROXIMATE' : 'FULL'
      });
    }
  })
)(GroupedTraces);

function GroupedTraces(props) {
  const { items, isChartSectionExpanded } = props;

  const groupColors = items.map(
    (group, groupIndex) =>
      theme.lib.colors.chart.strokeColors100[groupIndex % theme.lib.colors.chart.strokeColors100.length]
  );
  return (
    <AnalyzeWorkspace {...props} title="Trace Analytics">
      <GroupingTableHeader itemType="Group" {...props} forAnalyzeCalls />
      {isChartSectionExpanded && <ApplicationGroupMetricsChart {...props} groupColors={groupColors} />}
      <TraceGroupsTable {...props} groupColors={groupColors} />
    </AnalyzeWorkspace>
  );
}

function getOrderByForQuery(orderBy, dataSource, metricsForQuery) {
  const defaultOrderByForQuery = `${dataSource}_SUM_Agg`;

  if (orderBy === 'group' || orderBy === 'firstTimestamp' || metricsForQuery[orderBy] != null) {
    return orderBy;
  }
  return defaultOrderByForQuery;
}
