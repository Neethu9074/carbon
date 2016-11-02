import React from 'react';

import SidebarIncidents from 'in-components/IncidentSidebar';
import MapSidebar from 'in-components/MapSidebar';
import Controls from 'in-components/Controls';
import MapNotes from 'in-components/MapNotes';
import Map from 'in-map/Map';

export default function MapHandler(props) {
  return (
    <div>
      <section>
        <Map webVRMode={props.webVRMode} />
        <Controls />
        <SidebarIncidents />
        <MapSidebar />
        <MapNotes />
      </section>
      {props.children}
    </div>
  );
}
