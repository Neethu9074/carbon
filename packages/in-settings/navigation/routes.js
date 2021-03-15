/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import ConfigurationView from 'promise-loader?global,configView!in-settings/ConfigurationView';
import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import { settingsBasePath } from 'in-settings/navigation/paths';

export default (
  <Fragment>
    <Route path={settingsBasePath} component={createAsyncViewComponent(ConfigurationView)} />
  </Fragment>
);
