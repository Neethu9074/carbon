import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import { analyze, analyzeGroups, analyzeRaw, traceDetailFullyQualified } from 'in-analyze/navigation/paths';
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import GroupedTraces from 'promise-loader?global,analyze!in-analyze/GroupedTraces';
import TraceDetail from 'promise-loader?global,analyze!in-analyze/TraceDetail';
import RawTraces from 'promise-loader?global,analyze!in-analyze/RawTraces';
import CallsList from 'promise-loader?global,analyze!in-analyze/CallsList';
import { isQueryBuilderEnabled } from 'in-services/featureFlags';

export default (isQueryBuilderEnabled ? (
  <Fragment>
    <Route path={traceDetailFullyQualified} component={createAsyncViewComponent(TraceDetail)} />
    <Route path={analyzeGroups} component={createAsyncViewComponent(CallsList)} />
    <Route path={analyzeRaw} component={createAsyncViewComponent(CallsList)} />
    <Route path={analyze} component={createAsyncViewComponent(CallsList)} />
  </Fragment>
) : (
  <Fragment>
    <Route path={traceDetailFullyQualified} component={createAsyncViewComponent(TraceDetail)} />
    <Route path={analyzeGroups} component={createAsyncViewComponent(GroupedTraces)} />
    <Route path={analyzeRaw} component={createAsyncViewComponent(RawTraces)} />
  </Fragment>
));
