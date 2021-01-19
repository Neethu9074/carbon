/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import AnalyzeView from 'promise-loader?global,analyze!in-analyze/AnalyzeView';
import { analyze } from 'in-analyze/navigation/paths';

export default (
  <Fragment>
    <Route path={analyze} component={createAsyncViewComponent(AnalyzeView)} />
  </Fragment>
);
