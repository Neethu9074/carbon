import { Route, Switch } from 'react-router-dom';
import { compose } from 'recompose';
import React from 'react';

import GroupedProcessesRenderer from 'in-profiling/analyze/AnalyzeView/GroupedProfiledProcesses/GroupedProcessesRenderer';
import getProfiledProcessGroups from 'in-profiling/subscriptions/getProfiledProcessGroups';
import cursorPaginated from 'in-hoc/cursorPaginated';

export default function ProfiledProcesses(props) {
  return (
    <Switch>
      <Route path="*" render={() => <GroupedProcessesComponent {...props} />} />
    </Switch>
  );
}

const GroupedProcessesComponent = compose(
  cursorPaginated({
    getResettingProps: () => ['timeConfig', 'orderBy', 'orderDirection', 'tagFilters', 'group'],
    get: ({ tagFilters, cursor, timeConfig, orderBy, defaultSorting, orderDirection, group }) =>
      getProfiledProcessGroups({
        pagination: {
          cursor,
          retrievalSize: 20
        },
        order: {
          by: orderBy || defaultSorting,
          direction: orderDirection
        },
        filter: {
          timeConfig
        },
        metrics: {
          processes: {
            metric: 'processes',
            aggregation: 'DISTINCT_COUNT'
          }
        },
        tagFilters,
        group
      })
  })
)(GroupedProcessesRenderer);
