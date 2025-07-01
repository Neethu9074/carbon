/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

//@ts-expect-error - Cannot find module
import AccountAndBilling from 'promise-loader?global,amp!in-amp/pages/AccountAndBilling/AccountAndBilling';
import { Route } from 'react-router-dom';
import React from 'react';

//@ts-expect-error - Could not find a declaration file
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import { accountBillingBasePath } from 'in-amp/navigation/paths';

export default (
  <Route key="accountBilling" path={accountBillingBasePath}>
    {renderAsyncRouteChildren(AccountAndBilling)}
  </Route>
);
