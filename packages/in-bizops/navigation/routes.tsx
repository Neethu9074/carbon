/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// @ts-expect-error module need to be translated to TS
import BusinessProcessesList from 'promise-loader?global,bizops!in-bizops/lists/ProcessesList';
// @ts-expect-error module need to be translated to TS
import { Route } from 'react-router-dom';
import React from 'react';

// @ts-expect-error module need to be translated to TS
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import { bizopsPath } from 'in-bizops/navigation/paths';

export default [
  <Route key="businessProcessesList" exact path={bizopsPath}>
    {renderAsyncRouteChildren(BusinessProcessesList)}
  </Route>
];
