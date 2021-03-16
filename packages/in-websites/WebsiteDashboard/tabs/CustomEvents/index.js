/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Route, Switch } from 'react-router-dom';
import React from 'react';

import CustomEvents from 'in-websites/WebsiteDashboard/tabs/CustomEvents/CustomEvents';
import CustomEvent from 'in-websites/WebsiteDashboard/tabs/CustomEvents/CustomEvent';

export default function CustomEventIndex(props) {
  return (
    <Switch>
      <Route path="*/details" render={() => <CustomEvent {...props} />} />
      <Route path="*" render={() => <CustomEvents {...props} />} />
    </Switch>
  );
}
