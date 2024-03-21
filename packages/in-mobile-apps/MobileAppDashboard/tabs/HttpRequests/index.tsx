/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Route, Switch } from 'react-router-dom';
import React from 'react';

import HttpRequests from 'in-mobile-apps/MobileAppDashboard/tabs/HttpRequests/HttpRequests';
import HttpRequest from 'in-mobile-apps/MobileAppDashboard/tabs/HttpRequests/HttpRequest';

export interface HttpRequestIndexProp {
  mobileAppId: string;
  mobileAppLabel: string;
}

export default function HttpRequestsIndex(props: HttpRequestIndexProp) {
  return (
    <Switch>
      <Route path="*/details">
        <HttpRequest {...props} />
      </Route>
      <Route path="*">
        <HttpRequests {...props} />
      </Route>
    </Switch>
  );
}
