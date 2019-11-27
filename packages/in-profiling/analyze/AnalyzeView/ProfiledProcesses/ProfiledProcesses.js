import { Route, Switch } from 'react-router-dom';
import { compose } from 'recompose';
import React from 'react';

import ProfiledProcessesPresenter from 'in-profiling/analyze/AnalyzeView/ProfiledProcesses/ProfiledProcessesPresenter';
import ProfilesView from 'in-profiling/analyze/AnalyzeView/ProfilesView/ProfilesView';
import getProfiledProcesses from 'in-profiling/subscriptions/getProfiledProcesses';
import { analyzeProfilePathFullyQualified } from 'in-profiling/navigation/paths';
import cursorPaginated from 'in-hoc/cursorPaginated';

export default function ProfiledProcesses(props) {
  return (
    <Switch>
      <Route path={analyzeProfilePathFullyQualified} render={() => <ProfilesView {...props} />} />
      <Route path="*" render={() => <ProfiledProcessesComponent {...props} />} />
    </Switch>
  );
}

const ProfiledProcessesComponent = compose(
  cursorPaginated({
    getResettingProps: () => ['tagFilters', 'orderBy', 'orderDirection', 'timeConfig'],
    get: ({ tagFilters, timeConfig, cursor, orderBy, defaultSorting, orderDirection }) =>
      getProfiledProcesses({
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
        tagFilters: tagFilters
      })
  })
)(ProfiledProcessesPresenter);
