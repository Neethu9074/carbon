import { Route, Switch } from 'react-router-dom';
import React from 'react';

import DefaultLoadingDashboard from 'in-applications/Dashboards/DefaultLoadingDashboard';
import ViewWrapper from 'in-applications/TabView/components/View';

export default function TabSwitch({ tabs, result, location, props }) {
  const isLoading = result.progress.loading;
  const hasErrors = result.errors.length > 0;

  if (hasErrors) {
    return 'Errors';
  } else if (isLoading) {
    return <DefaultLoadingDashboard />;
  }

  return (
    <Switch>
      {tabs.map(tab => {
        return (
          <Route
            key={tab.path}
            path={tab.path}
            render={() => (
              <View
                ChildComponent={tab.component}
                label={tab.label}
                data={result.data}
                location={location}
                props={props}
              />
            )}
          />
        );
      })}
    </Switch>
  );
}

function View({ ChildComponent, label, data, location, props }) {
  return (
    <ViewWrapper title={label}>
      <ChildComponent data={data} location={location} {...props} />
    </ViewWrapper>
  );
}
