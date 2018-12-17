import { compose, withState } from 'recompose';
import { assign } from 'lodash';
import React from 'react';

import ApplicationGroupMetricsChart from 'in-analyze/components/ApplicationGroupMetricsChart';
import CallGroupsTable from 'in-analyze/components/GroupedCalls/CallGroupsTable';
import AnalyzeCallsWorkspace from 'in-analyze/components/AnalyzeCallsWorkspace';
import getCallGroups from 'in-subscription/application/getCallGroups';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import ResultHeader from 'in-analyze/components/ResultHeader';
import { getChartGranularity } from 'in-applications/metrics';
import { analyze } from 'in-analyze/navigation/paths';
import cursorPaginated from 'in-hoc/cursorPaginated';
import Button from 'in-new-components/Button';
import theme from 'in-themes';

import locals from './GroupedCalls.mless';

const defaultOrder = 'callsAgg';

export default compose(
  withUrlDependingState({
    getPathSegment: () => analyze,
    getMatrixPrefix: () => 'groups.',
    boundKeys: ['orderBy', 'orderDirection'],
    getInitialState: () => ({
      orderBy: defaultOrder,
      orderDirection: 'DESC'
    }),
    reducerName: 'onChangeOrder'
  }),
  withState('isChartSectionExpanded', 'setIsChartSectionExpanded', false),
  cursorPaginated({
    getResettingProps: () => ['filters', 'orderBy', 'orderDirection', 'isChartSectionExpanded'],
    get: ({ tagFiltersForSubscription, cursor, filters, orderBy, orderDirection, isChartSectionExpanded }) => {
      const timeConfig = filters.get('timeConfig');
      const granularity = getChartGranularity(timeConfig);
      const tableMetrics = {
        callsAgg: {
          metric: 'calls',
          aggregation: 'SUM'
        },
        latencyAgg: {
          metric: 'latency',
          aggregation: 'MEAN'
        },
        errorsAgg: {
          metric: 'errors',
          aggregation: 'MEAN'
        }
      };
      const chartMetrics = {
        calls: {
          metric: 'calls',
          aggregation: 'SUM',
          granularity
        },
        errors: {
          metric: 'errors',
          aggregation: 'MEAN',
          granularity
        },
        latency: {
          metric: 'latency',
          aggregation: 'MEAN',
          granularity
        }
      };

      return getCallGroups({
        pagination: {
          cursor,
          retrievalSize: 20
        },
        order: {
          by: orderBy || defaultOrder,
          direction: orderDirection
        },
        filter: {
          timeConfig
        },
        metrics: isChartSectionExpanded ? assign(tableMetrics, chartMetrics) : tableMetrics,
        tagFilters: tagFiltersForSubscription,
        group: {
          groupbyTag: filters.getIn(['group', 'name']),
          groupbyTagSecondLevelKey: filters.getIn(['group', 'value'], '')
        }
      });
    }
  })
)(GroupedCalls);

function GroupedCalls(props) {
  const { items, totalHits, isChartSectionExpanded, setIsChartSectionExpanded } = props;

  const groupColors = items.map(
    (group, groupIndex) =>
      theme.lib.colors.chart.strokeColors100[groupIndex % theme.lib.colors.chart.strokeColors100.length]
  );

  return (
    <AnalyzeCallsWorkspace {...props}>
      <div className={locals.wrapper}>
        <ResultHeader itemType="Group" nbRows={totalHits} />
        <Button
          kind="secondary"
          onClick={() => setIsChartSectionExpanded(!isChartSectionExpanded)}
          icon="lib_views_stats"
        >
          {isChartSectionExpanded ? 'Hide' : 'Show'} Graph
        </Button>
      </div>
      {isChartSectionExpanded && <ApplicationGroupMetricsChart {...props} groupColors={groupColors} />}
      <CallGroupsTable {...props} groupColors={groupColors} />
    </AnalyzeCallsWorkspace>
  );
}
