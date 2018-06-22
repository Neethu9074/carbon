import { compose } from 'recompose';
import React from 'react';

import { APPLICATION, SERVICE, ENDPOINT } from 'in-analyze/applicationFilter';
import getCallGroups from 'in-subscription/application/getCallGroups';
import CallGroupsTable from 'in-analyze/GroupedCalls/CallGroupsTable';
import CallGroupCharts from 'in-analyze/GroupedCalls/CallGroupCharts';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import { getChartGranularity } from 'in-applications/metrics';
import { analyze } from 'in-analyze/navigation/paths';
import cursorPaginated from 'in-hoc/cursorPaginated';
import Card from 'in-new-components/Card';
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
    getMatrixPrefix: () => 'traces.',
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
          timeConfig,
          application: filters.getIn(['applicationFilter', APPLICATION.id, 'value']),
          service: filters.getIn(['applicationFilter', SERVICE.id, 'value']),
          endpoint: filters.getIn(['applicationFilter', ENDPOINT.id, 'value'])
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
        groupbyTag: filters.getIn(['group', 'technicalName'])
      });
    }
  })
)(GroupedCalls);

function GroupedCalls(props) {
  const { items } = props;

  let label = 'Call Groups';
  if (items && items.length > 0) {
    label += ` (${items.length})`;
  }

  const callGroupColors = items.map(
    (group, groupIndex) =>
      theme.lib.colors.chart.strokeColors100[groupIndex % theme.lib.colors.chart.strokeColors100.length]
  );

  return (
    <Card title={label} withoutPadding>
      <CallGroupCharts {...props} callGroupColors={callGroupColors} />
      <CallGroupsTable {...props} callGroupColors={callGroupColors} />
    </Card>
  );
}
