import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import { analyzeGroups, analyzeRaw, traceDetailFullyQualified } from 'in-analyze/navigation/paths';

// the following components are all part of the same bundle.
// Bundle Name: analyze
import TraceDetail from 'promise-loader?global,analyze!in-analyze/TraceDetail';
import GroupedTraces from 'promise-loader?global,analyze!in-analyze/GroupedTraces';
import RawTraces from 'promise-loader?global,analyze!in-analyze/RawTraces';

export default (
  <Fragment>
    <Route path={traceDetailFullyQualified} component={createAsyncViewComponent(TraceDetail)} />
    <Route path={analyzeGroups} component={createAsyncViewComponent(GroupedTraces)} />
    <Route path={analyzeRaw} component={createAsyncViewComponent(RawTraces)} />
  </Fragment>
);
