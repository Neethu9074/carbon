/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import InfraPageHeaderWithTabs from 'in-infrastructure/components/InfraPageHeaderWithTabs';
import { getViewStructure } from 'in-infrastructure/perspectives/viewStructureStore';
import WithEmptyStateFallback from 'in-components/WithEmptyStateFallback';
import NotMonitoringMap from 'in-map/components/NotMonitoringMap';
import Controls from 'in-map/components/MapOverlayControls';
import MapSidebar from 'in-map/components/MapSidebar';
import MapNotes from 'in-map/components/MapNotes';
import Map from 'in-map/Map';

export default function MapHandler(props) {
  return (
    <InfraPageHeaderWithTabs>
      <WithEmptyStateFallback getHasDataToRender={getHasDataToRender} FallbackComponent={NotMonitoringMap}>
        <section>
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
