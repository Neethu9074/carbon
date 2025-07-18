/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// @ts-expect-error
import CollectorDashboard from 'promise-loader?global,infrastructure!in-infrastructure/CollectorsView/Dashboard/CollectorDashboard';
// @ts-expect-error
import CollectorView from 'promise-loader?global,infrastructure!in-infrastructure/CollectorsView/CollectorView';
import { Route } from 'react-router';
import React from 'react';

// @ts-expect-error
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import { otelCollectorDashboard } from 'in-infrastructure/CollectorsView/Navigation/paths';
import { otelCollectorViewEnabled } from 'in-services/featureFlags';

export default otelCollectorViewEnabled && (
  <Route key="collectorDashboard" path={otelCollectorDashboard}>
    {renderAsyncRouteChildren(CollectorDashboard)}
  </Route>
);
