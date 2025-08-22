/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Route, Switch } from 'react-router-dom';
import React from 'react';

import AnrStackTrace from 'in-mobile-apps/MobileAppDashboard/tabs/Performance/AnrStackTrace';
import Performance from 'in-mobile-apps/MobileAppDashboard/tabs/Performance/Performance';

export interface AnrStackTraceProperties {
  mobileAppId: string;
  mobileAppLabel: string;
  timeConfig: any;
}

export default function AnrStackTraceIndex(anrProps: AnrStackTraceProperties) {
  return (
    <Switch>
      <Route path="*/details">
        <AnrStackTrace {...anrProps} />
      </Route>
      <Route path="*">
        <Performance tagFilters={[]} {...anrProps} />
      </Route>
    </Switch>
  );
}
