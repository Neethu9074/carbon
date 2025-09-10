/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

const AIAgentCatalog = () => import(/*webpackChunkName: "ai-gateway"  */ 'in-aihub/AIAgentsComponents/AIAgentCatalog');
const GatewaysCatalog = () =>
  import(/* webpackChunkName: "ai-gateway" */ 'in-aihub/GatewaysCatalogComponents/GatewaysCatalog');

import { Route } from 'react-router';
import React from 'react';

// @ts-expect-error
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import { aihubGatewaysFullyQualified, aihubAIAgentsFullyQualified } from 'in-aihub/navigation/paths';

export default [
  <Route exact path={aihubGatewaysFullyQualified} key="InstanAIhubGateways">
    {renderAsyncRouteChildren(GatewaysCatalog)}
  </Route>,
  <Route exact path={aihubAIAgentsFullyQualified} key="InstanAIhubAIagents">
    {renderAsyncRouteChildren(AIAgentCatalog)}
  </Route>
];
