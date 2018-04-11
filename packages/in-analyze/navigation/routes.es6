import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import { analyzeGroups, analyzeRaw, traceDetailFullyQualified } from 'in-analyze/navigation/paths';

// the following components are all part of the same bundle.
// Bundle Name: analyze
import TraceDetail from 'promise-loader?global,analyze!in-analyze/TraceDetail';
import Analyze from 'promise-loader?global,analyze!in-analyze/Analyze';
import AnalyzeRaw from 'promise-loader?global,analyze!in-analyze/AnalyzeRaw';

export default (
  <Fragment>
    <Route path={traceDetailFullyQualified} component={createAsyncViewComponent(TraceDetail)} />
    <Route path={analyzeGroups} component={createAsyncViewComponent(Analyze)} />
    <Route path={analyzeRaw} component={createAsyncViewComponent(AnalyzeRaw)} />
  </Fragment>
);
