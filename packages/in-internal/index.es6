import { Switch, Route, Redirect } from 'react-router-dom';
import React from 'react';

import TuStatistics from 'in-internal/TuStatistics';
import DevDashboard from 'in-internal/DevDashboard';

export default function Internal() {
  return (
    <Switch>
      <Route path="/internal/devDashboard" component={DevDashboard} />
      <Route path="/internal/tuStatistics" component={TuStatistics} />
      <Redirect from="/internal" to="/internal/devDashboard" />
    </Switch>
  );
}
