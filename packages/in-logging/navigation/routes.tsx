/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

//@ts-expect-error needs TS migration
import AnalyzeView from 'promise-loader?global,logging!in-logging/analyze/AnalyzeView/AnalyzeView';
//@ts-expect-error needs TS migration
import { Route } from 'react-router-dom';
import React from 'react';

//@ts-expect-error needs TS migration
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import { logsPath } from 'in-logging/navigation/paths';

export default [<Route key="logsAnalyze" path={logsPath} children={renderAsyncRouteChildren(AnalyzeView)} />];
