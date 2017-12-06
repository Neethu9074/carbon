import { Switch, Route } from 'react-router-dom';
import React from 'react';

import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import Controls from 'in-components/MapOverlayControls';
import EventSidebar from 'in-components/EventSidebar';
import MapSidebar from 'in-components/MapSidebar';
import SearchBar from 'in-components/SearchBar';
import MapNotes from 'in-components/MapNotes';
import Sticky from 'in-components/Sticky';
import Map from 'in-map/Map';

export default function MapHandler(props) {
  return (
    <Switch>
      {DashboardNavigationRoute}

      <Route
        path="/*"
        render={() => (
          <Sticky header={<SearchBar />}>
            <section>
              <Map />
              <Controls />
              <EventSidebar />
              <MapSidebar />
              <MapNotes />
            </section>
            {props.children}
          </Sticky>
        )}
      />
    </Switch>
  );
}
