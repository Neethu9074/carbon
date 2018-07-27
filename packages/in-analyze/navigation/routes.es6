import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import { analyze, traceDetailFullyQualified } from 'in-analyze/navigation/paths';
import TraceDetail from 'promise-loader?global,analyze!in-analyze/TraceDetail';
import CallsList from 'promise-loader?global,analyze!in-analyze/Analyze';

export default (
  <Fragment>
    <Route path={traceDetailFullyQualified} component={createAsyncViewComponent(TraceDetail)} />
    <Route path={analyze} component={createAsyncViewComponent(CallsList)} />
  </Fragment>
);
