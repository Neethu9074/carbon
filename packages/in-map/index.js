import React from 'react';

import InfraPageHeaderWithTabs from 'in-infrastructure/components/InfraPageHeaderWithTabs';
import WithEmptyStateFallback from 'in-new-components/WithEmptyStateFallback';
import { getViewStructure } from 'in-map/stores/physical/viewStructureStore';
import NotMonitoringMap from 'in-map/components/NotMonitoringMap';
import Controls from 'in-map/components/MapOverlayControls';
import MapSidebar from 'in-map/components/MapSidebar';
import LegacyView from 'in-components/LegacyView';
import MapNotes from 'in-map/components/MapNotes';
import Map from 'in-map/Map';

export default function MapHandler(props) {
  return (
    <InfraPageHeaderWithTabs>
      <WithEmptyStateFallback getHasDataToRender={getHasDataToRender} FallbackComponent={NotMonitoringMap}>
        <section>
          <LegacyView />
          <Map />
          <Controls />
          <MapSidebar />
          <MapNotes />
        </section>
        {props.children}
      </WithEmptyStateFallback>
    </InfraPageHeaderWithTabs>
  );
}

function getHasDataToRender() {
  return getViewStructure().map(structure => structure.viewStructure.children.length > 0);
}
