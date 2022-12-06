/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// all the lazy loaded views. Bundle name: integrations
import IntegrationLandingPage from 'promise-loader?global,integrations!in-integrations/landing/IntegrationLandingPage';
import { Route } from 'react-router-dom';
import React from 'react';

import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import { landingPathFullyQualified } from 'in-integrations/navigation/paths';

export default (
  <Route
    key="integrationLanding"
    path={landingPathFullyQualified}
    children={renderAsyncRouteChildren(IntegrationLandingPage)}
  />
);
