/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Route, Switch } from 'react-router-dom';
import React from 'react';

import Alerts from 'in-applications/Dashboards/application/tabs/Alerts/Alerts';
import Alert from 'in-applications/Dashboards/application/tabs/Alerts/Alert';

export default function AlertsIndex(props) {
  return (
    <Switch>
      <Route path="*/details" render={() => <Alert {...props} />} />
      <Route path="*" render={() => <Alerts {...props} />} />
    </Switch>
  );
}
