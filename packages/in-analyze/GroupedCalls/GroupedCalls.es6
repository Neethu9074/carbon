import { compose, withState } from 'recompose';
import React, { Fragment } from 'react';
import { assign } from 'lodash';

import CallsAndGroupsIndicator from 'in-analyze/RawCalls/CallsAndGroupsIndicator';
import getCallGroups from 'in-subscription/application/getCallGroups';
import CallGroupsTable from 'in-analyze/GroupedCalls/CallGroupsTable';
import CallGroupCharts from 'in-analyze/GroupedCalls/CallGroupCharts';
import { evaluateClassNames } from 'in-services/util/classnames';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import { getChartGranularity } from 'in-applications/metrics';
import { analyze } from 'in-analyze/navigation/paths';
import cursorPaginated from 'in-hoc/cursorPaginated';
import SvgIcon from 'in-components/SvgIcon';
import theme from 'in-themes/theme';

import locals from './GroupedCalls.mless';

const defaultOrder = 'callsAgg';

export default compose(
  withUrlDependingState({
    getPathSegment: () => analyze,
    getMatrixPrefix: () => 'groupedCalls.',
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

  const callGroupColors = items.map(
    (group, groupIndex) =>
      theme.lib.colors.chart.strokeColors100[groupIndex % theme.lib.colors.chart.strokeColors100.length]
  );

  return (
    <Fragment>
      <div className={locals.callsAndGroupsIndicatorWrapper}>
        <CallsAndGroupsIndicator numGroups={totalHits} />
        <SvgIcon
          className={evaluateClassNames({
            [locals.chartIcon]: true,
            [locals.activeChartIcon]: isChartSectionExpanded
          })}
          type="lib_views_stats"
          width={40}
          height={40}
          onClick={() => setIsChartSectionExpanded(!isChartSectionExpanded)}
        />
      </div>
      {isChartSectionExpanded && <CallGroupCharts {...props} callGroupColors={callGroupColors} />}
      <CallGroupsTable {...props} callGroupColors={callGroupColors} />
    </Fragment>
  );
}
