import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import EventView from 'promise-loader?global!in-event-view/EventView';
import { eventsPath } from 'in-event-view/navigation/paths';

export default (
  <Fragment>
    <Route component={createAsyncViewComponent(EventView)} path={eventsPath} />
  </Fragment>
);
