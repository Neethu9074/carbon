/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import RawAnalyzeView from 'promise-loader?global,logging!in-logging/analyze/AnalyzeView/RawAnalyzeView';
import AnalyzeView from 'promise-loader?global,logging!in-logging/analyze/AnalyzeView/AnalyzeView';
import { Route } from 'react-router-dom';
import React from 'react';

import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import { logsPath, rawLogsPath } from 'in-logging/navigation/paths';

export default (
  <>
    <Route path={logsPath} component={createAsyncViewComponent(AnalyzeView)} />
    <Route path={rawLogsPath} component={createAsyncViewComponent(RawAnalyzeView)} />
  </>
);
