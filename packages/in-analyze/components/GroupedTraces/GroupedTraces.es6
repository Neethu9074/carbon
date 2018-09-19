import { compose, withState } from 'recompose';
import React, { Fragment } from 'react';
import { assign } from 'lodash';

import TraceGroupsTable from 'in-analyze/components/GroupedTraces/TraceGroupsTable';
import ItemsInGroupsIndicator from 'in-analyze/components/ItemsInGroupsIndicator';
import CallGroupCharts from 'in-analyze/components/GroupedCalls/CallGroupCharts';
import getCallGroups from 'in-subscription/application/getCallGroups';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import { getChartGranularity } from 'in-applications/metrics';
import { analyze } from 'in-analyze/navigation/paths';
import cursorPaginated from 'in-hoc/cursorPaginated';
import Button from 'in-new-components/Button';
import theme from 'in-themes/theme';

import locals from './GroupedTraces.mless';

const defaultOrder = 'callsAgg';

export default compose(
  withUrlDependingState({
    getPathSegment: () => analyze,
    getMatrixPrefix: () => 'groupedTraces.',
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
)(GroupedTraces);

function GroupedTraces(props) {
  const { items, totalHits, isChartSectionExpanded, setIsChartSectionExpanded } = props;

  const groupColors = items.map(
    (group, groupIndex) =>
      theme.lib.colors.chart.strokeColors100[groupIndex % theme.lib.colors.chart.strokeColors100.length]
  );

  return (
    <Fragment>
      <div className={locals.wrapper}>
        <ItemsInGroupsIndicator numGroups={totalHits} />
        <Button
          kind="secondary"
          onClick={() => setIsChartSectionExpanded(!isChartSectionExpanded)}
          icon="lib_views_stats"
        >
          {isChartSectionExpanded ? 'Hide' : 'Show'} Graph
        </Button>
      </div>
      {isChartSectionExpanded && <CallGroupCharts {...props} callGroupColors={groupColors} />}
      <TraceGroupsTable {...props} groupColors={groupColors} />
    </Fragment>
  );
}
