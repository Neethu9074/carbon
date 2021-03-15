/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import EventView from 'promise-loader?global!in-events/EventView';
import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import { eventsPath } from 'in-events/navigation/paths';

export default (
  <Fragment>
    <Route component={createAsyncViewComponent(EventView)} path={eventsPath} />
  </Fragment>
);
