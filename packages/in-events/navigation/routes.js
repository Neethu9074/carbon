/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const EventView = () => import(/* webpackChunkName: "events" */ 'in-events/EventView');
import { Route } from 'react-router-dom';
import React from 'react';

import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import { eventsPath } from 'in-events/navigation/paths';

export default (
  <Route key="eventsList" path={eventsPath}>
    {renderAsyncRouteChildren(EventView)}
  </Route>
);
