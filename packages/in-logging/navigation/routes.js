/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import AnalyzeView from 'promise-loader?global,logging!in-logging/analyze/AnalyzeView/AnalyzeView';
import { Route } from 'react-router-dom';
import React from 'react';

import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import { logsPath } from 'in-logging/navigation/paths';

export default [<Route key="logsAnalyze" path={logsPath} children={renderAsyncRouteChildren(AnalyzeView)} />];
