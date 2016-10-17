import irpt from 'react-immutable-proptypes';
import React from 'react';

import {getEventType, EVENT_TYPES} from 'in-services/issueTracker/issueTracker';
import Content from 'in-components/sidebars/Incident/components/Content';
import Header from 'in-components/sidebars/Incident/components/Header';
import {selectedIncident$} from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';

import 'in-components/sidebars/Incident/SidebarIncidents.less';


const block = 'in-sidebar-incidents';

export default connectTo({
  event: selectedIncident$
}, SidebarIncidents);

function SidebarIncidents({event}) {
  if (!event || getEventType(event) !== EVENT_TYPES.INCIDENT) {
    return null;
  }

  return (
    <div className={block}>
      <Header incident={event}/>
      <Content incident={event} />
    </div>
  );
}

SidebarIncidents.propTypes = {
  incident: irpt.map
};
