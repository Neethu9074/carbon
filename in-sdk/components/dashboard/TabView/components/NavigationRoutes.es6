import { Switch } from 'react-router-dom';
import React from 'react';

import { compareTabsForRoutingPreference } from 'in-sdk/components/dashboard/TabView/components/paths';
import RouteWithTitle from 'in-components/Navigation/RouteWithTitle';
import LifecycleObserver from 'in-components/LifecycleObserver';

import './NavigationRoutes.less';

const block = 'in-dashboard-nav-routes';

export default function NavigationRoutes({ tabs, props }) {
  return (
    <Switch>
      {//it is important to not have a route like '/' on top as this would match in any case
      //therefor sort the routes
      tabs
        .slice(0)
        .sort(compareTabsForRoutingPreference)
        .map(nav =>
          <RouteWithTitle
            key={`route_${nav.path}`}
            path={`*/dashboard${nav.path}`}
            render={() => <View ChildComponent={nav.component} props={props} />}
            windowTitle={nav.label}
          />
        )}
    </Switch>
  );
}

function View({ ChildComponent, props }) {
  return (
    <div className={block}>
      <LifecycleObserver onDidMount={forceScrollTop} />
      <ChildComponent {...props} />
    </div>
  );
}

// This is a super dirty hack to automatically scroll to the stop once
// the selected tab is changed. This is not a general purpose solution
// and it might break/result in jumping UIs for users.
//
// The only proper way to resolve this is to go
// away from custom scrollareas.
function forceScrollTop() {
  const ele = document.querySelector('.in-dashboard');
  if (ele) {
    ele.scrollTop = 0;
  }
}
