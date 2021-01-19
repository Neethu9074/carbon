/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { Route } from 'react-router-dom';
import React from 'react';

// all the lazy loaded views. Bundle name: cockpit
import Cockpit from 'promise-loader?global,cockpit!in-cockpit/Cockpit';

import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import { cockpit } from 'in-cockpit/navigation/paths';

export default <Route path={cockpit} component={createAsyncViewComponent(Cockpit)} />;
