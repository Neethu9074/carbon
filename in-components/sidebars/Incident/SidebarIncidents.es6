import irpt from 'react-immutable-proptypes';
import {on} from 'reactive-observables';
import React from 'react';

import IncidentContent from 'in-components/eventView/components/Incident/Content';
import {timelineHeight$} from 'in-components/timeline/timelineStore';
import {selectedIncident$} from 'in-stores/events';
import toPx from 'in-services/formatters/toPx';
import connectTo from 'in-hoc/connectTo';

import 'in-components/sidebars/Incident/SidebarIncidents.less';


const block = 'in-sidebar-incidents';

export default connectTo({
  incident: selectedIncident$,
  windowHeight: on(window, 'resize')
    .map(() => window.innerHeight)
    .startWithFn(() => window.innerHeight),
  timelineHeight: timelineHeight$
}, SidebarIncidents);

function SidebarIncidents({incident, windowHeight, timelineHeight}) {
  if (!incident) {
    return null;
  }

  return (
    <div className={block}
         style={{
           maxHeight: toPx(windowHeight - timelineHeight - 150)
         }}>
      <IncidentContent event={incident} />
    </div>
  );
}

SidebarIncidents.propTypes = {
  incident: irpt.map
};
