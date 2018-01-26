import { Route, Switch } from 'react-router-dom';
import React from 'react';

import { compareTabsForRoutingPreference } from 'in-sdk/components/dashboard/TabView/components/paths';
import DefaultLoadingDashboard from 'in-applications/Dashboards/DefaultLoadingDashboard';
import Title from 'in-components/Title';

export default function TabSwitch({ tabs, result }) {
  return (
    <Switch>
      {tabs
        .slice(0)
        .sort(compareTabsForRoutingPreference)
        .map(tab => {
          return (
            <Route
              key={`route_${tab.path}`}
              path={`*${tab.path}`}
              render={() => <View ChildComponent={tab.component} label={tab.label} result={result} />}
            />
          );
        })}
    </Switch>
  );
}

function View({ ChildComponent, label, result }) {
  const isLoading = result.progress.loading;
  const hasErrors = result.errors.length > 0;

  let content = null;
  if (hasErrors) {
    content = 'Errors';
  } else if (isLoading) {
    content = <DefaultLoadingDashboard key="default_loading_dashboard" />;
  } else {
    content = <ChildComponent key="content" result={result} />;
  }

  return [<Title key="title" title={label} />, { content }];
}
