import { Switch, Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import WithEmptyStateFallback from 'in-new-components/WithEmptyStateFallback';
import { getViewStructure } from 'in-map/stores/physical/viewStructureStore';
import ViewSwitcher from 'in-views/tableView/components/ViewSwitcher';
import NotMonitoringMap from 'in-map/components/NotMonitoringMap';
import DisabledBodyScroll from 'in-components/DisabledBodyScroll';
import Controls from 'in-components/MapOverlayControls';
import EventSidebar from 'in-components/EventSidebar';
import MapSidebar from 'in-components/MapSidebar';
import LegacyView from 'in-components/LegacyView';
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
          <Sticky
            header={
              <Fragment>
                <SearchBar />
                <ViewSwitcher darkTheme />
              </Fragment>
            }
          >
            <WithEmptyStateFallback getHasDataToRender={getHasDataToRender} FallbackComponent={NotMonitoringMap}>
              <section>
                <LegacyView />
                <DisabledBodyScroll />
                <Map />
                <Controls />
                <EventSidebar />
                <MapSidebar />
                <MapNotes />
              </section>
              {props.children}
            </WithEmptyStateFallback>
          </Sticky>
        )}
      />
    </Switch>
  );
}

function getHasDataToRender() {
  return getViewStructure().map(structure => structure.viewStructure.children.length > 0);
}
