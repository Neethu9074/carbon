/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

// @ts-expect-error module need to be translated to TS
import SyntheticLocationView from 'promise-loader?global,synthetics!in-synthetics/dashboards/global/LocationList';
// @ts-expect-error module need to be translated to TS
import SyntheticsView from 'promise-loader?global,synthetics!in-synthetics/dashboards/global/TestSummaryList';
// @ts-expect-error module need to be translated to TS
import AnalyzeView from 'promise-loader?global,synthetics!in-synthetics/dashboards/details/AnalyzeView';
//@ts-ignore
import SyntheticSummaryDashboard from 'promise-loader?global,synthetics!in-synthetics/dashboards/summary/SyntheticSummary';
// @ts-expect-error module need to be translated to TS
import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

// @ts-expect-error module need to be translated to TS
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import {
  syntheticsPath,
  syntheticLocationPath,
  syntheticsDashboard,
  syntheticDetailsPath
} from 'in-synthetics/navigation/paths';

export default (
  <Fragment>
    <Route exact path={syntheticsPath} component={createAsyncViewComponent(SyntheticsView)} />
    <Route exact path={syntheticLocationPath} component={createAsyncViewComponent(SyntheticLocationView)} />
    <Route path={syntheticsDashboard} component={createAsyncViewComponent(SyntheticSummaryDashboard)} />
    <Route path={syntheticDetailsPath} component={createAsyncViewComponent(AnalyzeView)} />
  </Fragment>
);
