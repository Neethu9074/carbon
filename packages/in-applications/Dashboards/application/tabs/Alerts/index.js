import { Route, Switch } from 'react-router-dom';
import React from 'react';

import Alerts from 'in-applications/Dashboards/application/tabs/Alerts/Alerts';

export default function AlertsIndex(props) {
  return (
    <Switch>
      <Route path="*" render={() => <Alerts {...props} />} />
    </Switch>
  );
}
