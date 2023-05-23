/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// @ts-expect-error there is currently no ts support for promise-loader
import ServiceLevelsObjectiveDashboard from 'promise-loader?global!in-service-levels/views/ServiceLevelsObjectiveDashboard';
// @ts-expect-error there is currently no ts support for promise-loader
import ServiceLevelsOverview from 'promise-loader?global!in-service-levels/views/ServiceLevelsOverview';
import { Route } from 'react-router';
import React from 'react';

// @ts-expect-error js to tsx migration
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import { serviceLevelsObjectiveFullyQualified, serviceLevelsOverview } from 'in-service-levels/navigation/path';

/* eslint-disable react/no-children-prop -- Passing children as a temporary workaround while migrating to react-router v6 */
export default [
  <Route
    key="sloDashboard"
    path={serviceLevelsObjectiveFullyQualified}
    children={renderAsyncRouteChildren(ServiceLevelsObjectiveDashboard)}
  />,
  <Route key="sloOverview" path={serviceLevelsOverview} children={renderAsyncRouteChildren(ServiceLevelsOverview)} />
];
/* eslint-enable react/no-children-prop */
