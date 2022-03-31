/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

// @ts-expect-error module need to be translated to TS
import SyntheticSummaryDashboard from 'promise-loader?global,synthetics!in-synthetics/dashboards/summary/SyntheticSummary';
// @ts-expect-error module need to be translated to TS
import SyntheticsView from 'promise-loader?global,synthetics!in-synthetics/dashboards/global/Dashboard';
// @ts-expect-error module need to be translated to TS
import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

// @ts-expect-error module need to be translated to TS
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import { syntheticsPath, syntheticsSummaryPath } from 'in-synthetics/navigation/paths';

export default (
  <Fragment>
    <Route exact path={syntheticsPath} component={createAsyncViewComponent(SyntheticsView)} />
    <Route path={syntheticsSummaryPath} component={createAsyncViewComponent(SyntheticSummaryDashboard)} />
  </Fragment>
);
