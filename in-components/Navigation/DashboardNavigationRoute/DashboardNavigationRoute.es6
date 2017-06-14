import React from 'react';

import RouteWithTitle from 'in-components/Navigation/RouteWithTitle';
import Dashboard from 'in-components/Dashboard';

export default function DashboardNavigationRoute(props) {
  return (
    <RouteWithTitle
      path={props.path || '*/dashboard'}
      component={Dashboard}
      windowTitle={props.windowTitle || 'Dashboard'}
    />
  );
}
