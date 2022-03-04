/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

// @ts-expect-error module need to be translated to TS
import Summary from 'promise-loader?global,synthetics!in-synthetics/testResultDashboards/Summary';
// @ts-expect-error module need to be translated to TS
import SyntheticsView from 'promise-loader?global,synthetics!in-synthetics/Dashboard';
// @ts-expect-error module need to be translated to TS
import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

// @ts-expect-error module need to be translated to TS
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import { syntheticsPath, testResultSummaryPath } from 'in-synthetics/navigation/paths';

export default (
  <Fragment>
    <Route exact path={syntheticsPath} component={createAsyncViewComponent(SyntheticsView)} />
    <Route path={testResultSummaryPath} component={createAsyncViewComponent(Summary)} />
  </Fragment>
);
