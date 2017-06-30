import React from 'react';

import RouteWithTitle from 'in-components/Navigation/RouteWithTitle';
import { Switch } from 'react-router-dom';

export default function NavigationRoutes({ navigationStructure }) {
  return (
    <Switch>
      {//it is important to not have a route like '/' on top as this would match in any case
      //therefor sort the routes
      navigationStructure
        .slice(0)
        .sort(sortStructure)
        .map(nav =>
          <RouteWithTitle
            key={`route_${nav.path}`}
            path={`*/dashboard${nav.path}`}
            component={nav.component}
            windowTitle={nav.label}
          />
        )}
    </Switch>
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
