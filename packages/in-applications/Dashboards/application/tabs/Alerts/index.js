/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Route, Switch } from 'react-router-dom';
import React from 'react';

import AlertDetails from 'in-alerting/smart-alerts/applications/details/AlertDetails';
import Alerts from 'in-applications/Dashboards/application/tabs/Alerts/Alerts';

export default function AlertsIndex(props) {
  return (
    <Switch>
      <Route path="*/details" render={() => <AlertDetails {...props} />} />
      <Route path="*" render={() => <Alerts {...props} />} />
    </Switch>
  );
}
