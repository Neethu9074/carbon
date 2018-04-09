import { compose } from 'recompose';
import React from 'react';

import TraceGroupsCharts from 'in-analyze/Analyze/TraceGroups/TraceGroupsCharts';
import TraceGroupsTable from 'in-analyze/Analyze/TraceGroups/TraceGroupsTable';
import getTraceGroups from 'in-subscription/application/getTraceGroups';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import { getChartGranularity } from 'in-applications/metrics';
import { analyze } from 'in-analyze/navigation/paths';
import cursorPaginated from 'in-hoc/cursorPaginated';
import { app20Chart } from 'in-themes/theme';
import Card from 'in-new-components/Card';

const orderTranslation = {
  label: 'rootEndpointLabel',
  calls: 'calls',
  duration: 'duration',
  errors: 'errors'
};

export default compose(
  withUrlDependingState({
    getPathSegment: () => analyze,
    getMatrixPrefix: () => 'traces.',
    boundKeys: ['orderBy', 'orderDirection'],
    getInitialState: () => ({
      orderBy: 'calls',
      orderDirection: 'DESC'
    }),
    reducerName: 'onChangeOrder'
  }),
  cursorPaginated({
    getResettingProps: () => ['filter', 'orderBy', 'orderDirection'],
    get: ({ cursor, filter, orderBy, orderDirection }) => {
      const granularity = getChartGranularity(filter.timeframe);
      return getTraceGroups({
        pagination: {
          cursor,
          retrievalSize: 20
        },
        order: {
          by: orderTranslation[orderBy] || '',
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
)(TraceGroupsWithCharts);

function TraceGroupsWithCharts(props) {
  const { items } = props;

  let label = 'Traces Groups';
  let traceGroupColors = [];
  if (items && items.length > 0) {
    label = `Traces Groups (${items.length})`;
    traceGroupColors = items.map(
      (group, groupIndex) => app20Chart.strokeColors100[groupIndex % app20Chart.strokeColors100.length]
    );
  }

  return (
    <Card title={label}>
      <TraceGroupsCharts {...props} traceGroupColors={traceGroupColors} />
      <TraceGroupsTable {...props} traceGroupColors={traceGroupColors} />
    </Card>
  );
}
