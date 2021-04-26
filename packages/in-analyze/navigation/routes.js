/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import AnalyzeView2_0 from 'promise-loader?global,applications!in-applications/analyze/AnalyzeView2_0/AnalyzeView';
import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import { analyze } from 'in-analyze/navigation/paths';

export default (
  <Fragment>
    <Route path={analyze} component={createAsyncViewComponent(AnalyzeView2_0)} />
  </Fragment>
);
