import irpt from 'react-immutable-proptypes';
import React from 'react';

import IncidentContent from 'in-components/eventView/components/Incident/Content';
import {selectedIncident$} from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';

import 'in-components/sidebars/Incident/SidebarIncidents.less';


const block = 'in-sidebar-incidents';

export default connectTo({
  incident: selectedIncident$
}, SidebarIncidents);

function SidebarIncidents({incident}) {
  if (!incident) {
    return null;
  }

  return (
    <div className={block}>
      <IncidentContent event={incident} />
    </div>
  );
}

SidebarIncidents.propTypes = {
  incident: irpt.map
};
