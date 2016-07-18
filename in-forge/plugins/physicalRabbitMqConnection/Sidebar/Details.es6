import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalSidebarKpis from 'in-components/DefaultLogicalSidebarKpis/DefaultLogicalSidebarKpis';


export default function PhysicalRabbitMqConnectionSidebar({snapshot}) {
  return (
    <DefaultLogicalSidebarKpis snapshot={snapshot} />
  );
}

PhysicalRabbitMqConnectionSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
