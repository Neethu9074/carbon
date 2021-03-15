/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Route, Switch } from 'react-router-dom';
import React from 'react';

import Errors from 'in-websites/WebsiteDashboard/tabs/Errors/Errors';
import Error from 'in-websites/WebsiteDashboard/tabs/Errors/Error';

export default function ErrorIndex(props) {
  return (
    <Switch>
      <Route path="*/details" render={() => <Error {...props} />} />
      <Route path="*" render={() => <Errors {...props} />} />
    </Switch>
  );
}
