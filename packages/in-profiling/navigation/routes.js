import { Route } from 'react-router-dom';
import React from 'react';

import { analyzePathFullyQualified, profilingPath, analyzePath } from 'in-profiling/navigation/paths';
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';

import AnalyzeView from 'promise-loader?global,profiling!in-profiling/analyze/AnalyzeView/AnalyzeView';

export default (
  <>
    <Route path={analyzePathFullyQualified} component={createAsyncViewComponent(AnalyzeView)} />
    <RedirectWithHash from={profilingPath} to={analyzePath} />
  </>
);
