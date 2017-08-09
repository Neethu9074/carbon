import React from 'react';

import RouteWithTitle from 'in-components/Navigation/RouteWithTitle';
import { Switch } from 'react-router-dom';

import './NavigationRoutes.less';

const block = 'in-dashboard-nav-routes';

export default function NavigationRoutes({ tabs, props }) {
  return (
    <Switch>
      {//it is important to not have a route like '/' on top as this would match in any case
      //therefor sort the routes
      tabs
        .slice(0)
        .sort(sortStructure)
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
      <ChildComponent {...props} />
    </div>
  );
}

function sortStructure(nav1, nav2) {
  if (nav1.path.length > nav2.path.length) {
    return -1;
  } else if (nav1.path.length < nav2.path.length) {
    return 1;
  } else {
    return 0;
  }
}
