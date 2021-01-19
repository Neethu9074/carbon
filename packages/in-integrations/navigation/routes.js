/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import { landingPathFullyQualified } from 'in-integrations/navigation/paths';
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';

// all the lazy loaded views. Bundle name: integrations
import IntegrationLandingPage from 'promise-loader?global,integrations!in-integrations/landing/IntegrationLandingPage';

export default (
  <Fragment>
    <Route path={landingPathFullyQualified} component={createAsyncViewComponent(IntegrationLandingPage)} />
  </Fragment>
);
