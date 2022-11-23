/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import AnalyzeView from 'promise-loader?global,profiling!in-profiling/analyze/AnalyzeView/AnalyzeView';
import { Route } from 'react-router-dom';
import React from 'react';

import { analyzePathFullyQualified, profilingPath, analyzePath } from 'in-components/Profiling/navigation/paths';
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default [
  <Route key="analyzeProfiles" path={analyzePathFullyQualified} children={renderAsyncRouteChildren(AnalyzeView)} />,
  <RedirectWithHash key="redirectToAnalyzeProfiles" from={profilingPath} to={analyzePath} />
];
