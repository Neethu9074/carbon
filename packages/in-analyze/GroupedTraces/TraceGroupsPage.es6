import { compose } from 'recompose';
import React from 'react';

import TraceGroupsCharts from 'in-analyze/GroupedTraces/TraceGroupsCharts';
import TraceGroupsTable from 'in-analyze/GroupedTraces/TraceGroupsTable';
import getTraceGroups from 'in-subscription/application/getTraceGroups';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import GroupingToggle from 'in-analyze/shared/GroupingToggle';
import { getChartGranularity } from 'in-applications/metrics';
import { analyze } from 'in-analyze/navigation/paths';
import cursorPaginated from 'in-hoc/cursorPaginated';
import { app20Chart } from 'in-themes/theme';
import Card from 'in-new-components/Card';

const orderTranslation = {
  label: 'concat_dest_service_endpoint',
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
    getResettingProps: () => ['filter', 'orderBy', 'orderDirection'],
    get: ({ cursor, filter, orderBy, orderDirection }) => {
      const granularity = getChartGranularity(filter.timeConfig);
      return getTraceGroups({
        pagination: {
          cursor,
          retrievalSize: 20
        },
        order: {
          by: orderTranslation[orderBy] || defaultOrder,
          direction: orderDirection
        },
        filter,
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
        }
      });
    }
  })
)(TraceGroupsPage);

function TraceGroupsPage(props) {
  const { items } = props;

  let label = 'Trace Groups';
  let traceGroupColors = [];
  if (items && items.length > 0) {
    label += ` (${items.length})`;
    traceGroupColors = items.map(
      (group, groupIndex) => app20Chart.strokeColors100[groupIndex % app20Chart.strokeColors100.length]
    );
  }

  return (
    <Card title={label} header={<GroupingToggle raw={false} />} withoutPadding>
      <TraceGroupsCharts {...props} traceGroupColors={traceGroupColors} />
      <TraceGroupsTable {...props} traceGroupColors={traceGroupColors} />
    </Card>
  );
}
