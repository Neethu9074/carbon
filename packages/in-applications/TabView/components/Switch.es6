import { Route, Switch } from 'react-router-dom';
import React from 'react';

import { compareTabsForRoutingPreference } from 'in-sdk/components/dashboard/TabView/components/paths';
import DefaultLoadingDashboard from 'in-applications/Dashboards/DefaultLoadingDashboard';
import ViewWrapper from 'in-applications/TabView/components/View';

export default function TabSwitch({ tabs, result }) {
  const isLoading = result.progress.loading;
  const hasErrors = result.errors.length > 0;

  if (hasErrors) {
    return 'Errors';
  } else if (isLoading) {
    return <DefaultLoadingDashboard key="default_loading_dashboard" />;
  }

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
  return (
    <ViewWrapper title={label}>
      <ChildComponent result={result} />
    </ViewWrapper>
  );
}
