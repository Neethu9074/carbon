/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Route, Switch } from 'react-router-dom';
import React from 'react';

import HttpRequests from 'in-mobile-apps/MobileAppDashboard/tabs/HttpRequests/HttpRequests';
import HttpRequest from 'in-mobile-apps/MobileAppDashboard/tabs/HttpRequests/HttpRequest';

export default function HttpRequestsIndex(props) {
  return (
    <Switch>
      <Route path="*/details" render={() => <HttpRequest {...props} />} />
      <Route path="*" render={() => <HttpRequests {...props} />} />
    </Switch>
  );
}
