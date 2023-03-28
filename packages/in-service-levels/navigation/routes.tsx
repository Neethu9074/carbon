/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// @ts-expect-error js to tsx migration
import ServiceLevelsDashboard from 'promise-loader?global!in-service-levels/ServiceLevelsDashboard';
import { Route } from 'react-router';
import React from 'react';

// @ts-expect-error js to tsx migration
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import { serviceLevelsDashboard } from 'in-service-levels/navigation/path';

export default [
  <Route key="slo" path={serviceLevelsDashboard} children={renderAsyncRouteChildren(ServiceLevelsDashboard)} />
];
