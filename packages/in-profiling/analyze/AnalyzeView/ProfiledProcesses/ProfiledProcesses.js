/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Route, Switch } from 'react-router-dom';
import React from 'react';

import ProfiledProcessesPresenter from 'in-profiling/analyze/AnalyzeView/ProfiledProcesses/ProfiledProcessesPresenter';
import { analyzeProfilePathFullyQualified } from 'in-components/Profiling/navigation/paths';
import ProfilesView from 'in-profiling/analyze/AnalyzeView/ProfilesView/ProfilesView';
import getProfiledProcesses from 'in-profiling/subscriptions/getProfiledProcesses';
import cursorPaginated from 'in-hoc/cursorPaginated';
import { query$ } from 'in-stores/search/query';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    query: query$
  },
  function ProfiledProcesses(props) {
    return (
      <Switch>
        <Route path={analyzeProfilePathFullyQualified}>
          <ProfilesView {...props} />
        </Route>
        <Route path="*">
          <ProfiledProcessesComponent {...props} />
        </Route>
      </Switch>
    );
  }
);

const ProfiledProcessesComponent = cursorPaginated({
  getResettingProps: () => ['query', 'timeConfig'],
  get: ({ timeConfig, cursor }) =>
    query$.debounce(1000).flatMap(query =>
      getProfiledProcesses({
        pagination: {
          cursor,
          retrievalSize: 20
        },
        query,
        timeConfig
      })
    )
})(ProfiledProcessesPresenter);
