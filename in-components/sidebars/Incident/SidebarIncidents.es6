import irpt from 'react-immutable-proptypes';
import React from 'react';

import Content from 'in-components/sidebars/Incident/components/Content';
import Header from 'in-components/sidebars/Incident/components/Header';
import getSelectedIncident from 'in-hoc/getSelectedIncident';

import 'in-components/sidebars/Incident/SidebarIncidents.less';


const block = 'in-sidebar-incidents';

export default getSelectedIncident(SidebarIncidents);

function SidebarIncidents({incident}) {
  if (!incident) {
    return null;
  }

  return (
    <div className={block}>
      <Header incident={incident}/>
      <Content incident={incident} />
    </div>
  );
}

SidebarIncidents.propTypes = {
  incidentId: React.PropTypes.string,
  incident: irpt.map
};
