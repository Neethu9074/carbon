import AnalyzeView from 'promise-loader?global,logging!in-logging/analyze/AnalyzeView/AnalyzeView';
import { Route } from 'react-router-dom';
import React from 'react';

import { analyzePathFullyQualified, logsPath, analyzePath } from 'in-logging/navigation/paths';
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default (
  <>
    <Route path={analyzePathFullyQualified} component={createAsyncViewComponent(AnalyzeView)} />
    <RedirectWithHash from={logsPath} to={analyzePath} />
  </>
);
