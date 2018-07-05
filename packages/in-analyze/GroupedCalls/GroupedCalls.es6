import React, { Fragment } from 'react';
import { compose } from 'recompose';
import { get } from 'lodash';

import CallsAndGroupsIndicator from 'in-analyze/RawCalls/CallsAndGroupsIndicator';
import getCallGroups from 'in-subscription/application/getCallGroups';
import CallGroupsTable from 'in-analyze/GroupedCalls/CallGroupsTable';
import CallGroupCharts from 'in-analyze/GroupedCalls/CallGroupCharts';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import { getChartGranularity } from 'in-applications/metrics';
import { analyze } from 'in-analyze/navigation/paths';
import cursorPaginated from 'in-hoc/cursorPaginated';
import theme from 'in-themes/theme';

const orderTranslation = {
  service: 'concat_dest_service_endpoint',
  calls: 'calls',
  duration: 'duration',
  errors: 'errors'
};

const defaultOrder = orderTranslation['calls'];

export default compose(
  withUrlDependingState({
    getPathSegment: () => analyze,
    getMatrixPrefix: () => 'calls.',
    boundKeys: ['orderBy', 'orderDirection'],
    getInitialState: () => ({
      orderBy: defaultOrder,
      orderDirection: 'DESC'
    }),
    reducerName: 'onChangeOrder'
  }),
  cursorPaginated({
    getResettingProps: () => ['filters', 'orderBy', 'orderDirection'],
    get: ({ tagFiltersForSubscription, cursor, filters, orderBy, orderDirection }) => {
      const timeConfig = filters.get('timeConfig');
      const granularity = getChartGranularity(timeConfig);
      return getCallGroups({
        pagination: {
          cursor,
          retrievalSize: 20
        },
        order: {
          by: orderTranslation[orderBy] || defaultOrder,
          direction: orderDirection
        },
        filter: {
          timeConfig
        },
        metrics: {
          calls: {
            metric: 'calls',
            aggregation: 'SUM'
          },
          duration: {
            metric: 'latency',
            aggregation: 'MEAN'
          },
          errors: {
            metric: 'errors',
            aggregation: 'MEAN'
          },
          callsChartData: {
            metric: 'calls',
            aggregation: 'SUM',
            granularity
          },
          errorsChartData: {
            metric: 'errors',
            aggregation: 'MEAN',
            granularity
          },
          latencyChartData: {
            metric: 'latency',
            aggregation: 'MEAN',
            granularity
          }
        },
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
  const { items, totalHits } = props;

  const totalCounts = items.map(item => get(item, ['metrics', 'calls', 0, 1], 0)).reduce((a, b) => a + b, 0);

  const callGroupColors = items.map(
    (group, groupIndex) =>
      theme.lib.colors.chart.strokeColors100[groupIndex % theme.lib.colors.chart.strokeColors100.length]
  );

  return (
    <Fragment>
      <CallsAndGroupsIndicator numCalls={totalCounts} numGroups={totalHits} />
      <CallGroupCharts {...props} callGroupColors={callGroupColors} />
      <CallGroupsTable {...props} callGroupColors={callGroupColors} />
    </Fragment>
  );
}
