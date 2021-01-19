/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { Route, Switch } from 'react-router-dom';
import React from 'react';

import Resources from 'in-websites/WebsiteDashboard/tabs/Resources/Resources';
import Resource from 'in-websites/WebsiteDashboard/tabs/Resources/Resource';

export default function ResourceIndex(props) {
  return (
    <Switch>
      <Route path="*/details" render={() => <Resource {...props} />} />
      <Route path="*" render={() => <Resources {...props} />} />
    </Switch>
  );
}
