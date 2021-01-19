/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { Route, Switch } from 'react-router-dom';
import React from 'react';

import XhrRequests from 'in-websites/WebsiteDashboard/tabs/Ajax/XhrRequests';
import XhrRequest from 'in-websites/WebsiteDashboard/tabs/Ajax/XhrRequest';

export default function ResourceIndex(props) {
  return (
    <Switch>
      <Route path="*/details" render={() => <XhrRequest {...props} />} />
      <Route path="*" render={() => <XhrRequests {...props} />} />
    </Switch>
  );
}
