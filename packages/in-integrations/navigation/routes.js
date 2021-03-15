/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// all the lazy loaded views. Bundle name: integrations
import IntegrationLandingPage from 'promise-loader?global,integrations!in-integrations/landing/IntegrationLandingPage';
import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import { landingPathFullyQualified } from 'in-integrations/navigation/paths';

export default (
  <Fragment>
    <Route path={landingPathFullyQualified} component={createAsyncViewComponent(IntegrationLandingPage)} />
  </Fragment>
);
