/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Route, Switch } from 'react-router-dom';
import React from 'react';

import { useObservable } from '@instana/hooks';

import ProfiledProcessesPresenter from 'in-profiling/analyze/AnalyzeView/ProfiledProcesses/ProfiledProcessesPresenter';
import { analyzeProfilePathFullyQualified } from 'in-components/Profiling/navigation/paths';
import ProfilesView from 'in-profiling/analyze/AnalyzeView/ProfilesView/ProfilesView';
import { query$ } from 'in-stores/search/query';

export default function ProfiledProcesses(props) {
  const query = useObservable(query$, []);
  const data = {
    ...props,
    query
  };
  return (
    <Switch>
      <Route path={analyzeProfilePathFullyQualified}>
        <ProfilesView {...data} />
      </Route>
      <Route path="*">
        <ProfiledProcessesPresenter {...data} />
      </Route>
    </Switch>
  );
}
