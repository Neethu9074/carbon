/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import AutomationView from 'promise-loader?global,automation!in-automation/AutomationView';
import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import { automation } from 'in-automation/navigation/paths';

export default (
  <Fragment>
    <Route path={automation} component={createAsyncViewComponent(AutomationView)} />
  </Fragment>
);
