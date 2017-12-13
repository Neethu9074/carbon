import { Switch, Route, Redirect } from 'react-router-dom';
import React from 'react';

import DevDashboard from 'in-internal/DevDashboard';

export default function Internal() {
  return (
    <Switch>
      <Route path="/internal/devDashboard" component={DevDashboard} />
      <Redirect from="/internal" to="/internal/devDashboard" />
    </Switch>
  );
}
