import { compose } from 'recompose';
import React from 'react';

import TraceGroupsCharts from 'in-analyze/Analyze/TraceGroups/TraceGroupsCharts';
import TraceGroupsTable from 'in-analyze/Analyze/TraceGroups/TraceGroupsTable';
import getTraceGroups from 'in-subscription/application/getTraceGroups';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import { analyze } from 'in-analyze/navigation/paths';
import cursorPaginated from 'in-hoc/cursorPaginated';
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
    get: ({ cursor, filter, orderBy, orderDirection }) =>
      getTraceGroups({
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
          }
        }
      })
  })
)(TraceGroupsWithCharts);

function TraceGroupsWithCharts(props) {
  // TODO TraceGroupsCharts and the first level of TraceGroupsTable could (should?) use the same data.
  // TODO Actually, we already need the data here, to be able to show the number of traces in the card title:
  // "Traces (35)"
  return (
    <Card title="Traces">
      <TraceGroupsCharts {...props} />
      <TraceGroupsTable {...props} />
    </Card>
  );
}
