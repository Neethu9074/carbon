import { compose } from 'recompose';
import React from 'react';

import TraceGroupsCharts from 'in-analyze/Analyze/TraceGroups/TraceGroupsCharts';
import TraceGroupsTable from 'in-analyze/Analyze/TraceGroups/TraceGroupsTable';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import { analyze } from 'in-analyze/navigation/paths';
import Card from 'in-new-components/Card';

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
  })
)(TraceGroupsWithCharts);

function TraceGroupsWithCharts(props) {
  // TODO TraceGroupsCharts and the first level of TraceGroupsTable could (should?) use the same data.
  // TODO Actually, we already need the data here, to be able to show the number of traces in the card title:
  // "Traces (35)"
  return (
    <Card title="Traces">
      <TraceGroupsCharts filter={props.filter} />
      <TraceGroupsTable {...props} />
    </Card>
  );
}
