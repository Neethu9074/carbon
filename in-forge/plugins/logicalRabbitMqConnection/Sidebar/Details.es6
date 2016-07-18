import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalSidebarKpis from 'in-components/DefaultLogicalSidebarKpis/DefaultLogicalSidebarKpis';


export default function LogicalRabbitMqConnectionSidebar({snapshot}) {
  return (
    <DefaultLogicalSidebarKpis snapshot={snapshot} />
  );
}

LogicalRabbitMqConnectionSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
