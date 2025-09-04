/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

const WelcomePage = () => import(/* webpackChunkName: "plg" */ 'in-plg/pages/WelcomePage/WelcomePage');
import { Route } from 'react-router-dom';
import React from 'react';

//@ts-expect-error - Could not find a declaration file
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import { welcomePage } from 'in-plg/navigation/paths';

export default (
  <Route key="welcomePage" path={welcomePage}>
    {renderAsyncRouteChildren(WelcomePage)}
  </Route>
);
