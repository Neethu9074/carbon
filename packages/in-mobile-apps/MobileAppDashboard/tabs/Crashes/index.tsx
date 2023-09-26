/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Route, Switch } from 'react-router-dom';
import React from 'react';

import Crashes from 'in-mobile-apps/MobileAppDashboard/tabs/Crashes/Crashes';
import Crash from 'in-mobile-apps/MobileAppDashboard/tabs/Crashes/Crash';

export interface CrashProperties {
  mobileAppId: string;
  mobileAppLabel: string;
}

export default function CrashesIndex(crashProps: CrashProperties) {
  return (
    <Switch>
      <Route path="*/details">
        <Crash {...crashProps} />
      </Route>
      <Route path="*">
        <Crashes {...crashProps} />
      </Route>
    </Switch>
  );
}
