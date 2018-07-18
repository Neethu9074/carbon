import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import { analyze, analyzeGroups, analyzeRaw, traceDetailFullyQualified } from 'in-analyze/navigation/paths';
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import TraceDetail from 'promise-loader?global,analyze!in-analyze/TraceDetail';
import CallsList from 'promise-loader?global,analyze!in-analyze/CallsList';

export default (
  <Fragment>
    <Route path={traceDetailFullyQualified} component={createAsyncViewComponent(TraceDetail)} />
    <Route path={analyzeGroups} component={createAsyncViewComponent(CallsList)} />
    <Route path={analyzeRaw} component={createAsyncViewComponent(CallsList)} />
    <Route path={analyze} component={createAsyncViewComponent(CallsList)} />
  </Fragment>
);
