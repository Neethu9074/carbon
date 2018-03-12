import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import { analyze, traceListFullyQualified, traceDetailFullyQualified } from 'in-analyze/navigation/paths';

// the following components are all part of the same bundle.
// Bundle Name: analyze
import TraceDetail from 'promise-loader?global,analyze!in-analyze/TraceDetail';
import TraceList from 'promise-loader?global,analyze!in-analyze/TraceList';
import Analyze from 'promise-loader?global,analyze!in-analyze/Analyze';

export default (
  <Fragment>
    <Route path={traceListFullyQualified} component={createAsyncViewComponent(TraceList)} />
    <Route path={traceDetailFullyQualified} component={createAsyncViewComponent(TraceDetail)} />
    <Route path={analyze} component={createAsyncViewComponent(Analyze)} />
  </Fragment>
);
