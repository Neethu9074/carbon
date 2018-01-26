import { Route, Switch } from 'react-router-dom';
import React from 'react';

import { compareTabsForRoutingPreference } from 'in-sdk/components/dashboard/TabView/components/paths';
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
              render={() => <View ChildComponent={tab.component} label={tab.label} props={{ result }} />}
            />
          );
        })}
    </Switch>
  );
}

function View({ ChildComponent, label, props }) {
  return (
    <div>
      <Title title={label} />
      <ChildComponent {...props} />
    </div>
  );
}
