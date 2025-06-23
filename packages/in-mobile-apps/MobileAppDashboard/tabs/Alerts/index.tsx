/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Route, Switch } from 'react-router-dom';
import React from 'react';

import AlertDetails from 'in-alerting/smart-alerts/mobileApp/details/AlertDetails';
import Alerts from 'in-alerting/smart-alerts/mobileApp/Alerts';

export interface AlertsProps {
  mobileAppId: string;
  mobileAppLabel: string;
  isEventsView?: boolean;
}

export default function AlertsIndex(props: AlertsProps) {
  return (
    <Switch>
      <Route path="*/details">
        <AlertDetails {...props} />
      </Route>
      <Route path="*">
        <Alerts {...props} />
      </Route>
    </Switch>
  );
}
