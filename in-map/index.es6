import React from 'react';

import SidebarIncidents from 'in-components/sidebars/Incident';
import MapSidebar from 'in-components/Sidebar/MapSidebar';
import TableView from 'in-components/tableView/TableView';
import Controls from 'in-components/Controls';
import MapNotes from 'in-components/MapNotes';
import Map from 'in-map/Map';

export default function MapHandler(props) {
  return (
    <div>
      <section>
        <Map webVRMode={props.webVRMode} />
        <Controls />
        <TableView />
        <SidebarIncidents />
        <MapSidebar />
        <MapNotes />
      </section>
      {props.children}
    </div>
  );
}
