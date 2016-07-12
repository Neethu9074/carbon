import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalSidebarKpis from 'in-components/DefaultLogicalSidebarKpis/DefaultLogicalSidebarKpis';


export default function LogicalServiceSidebar({snapshot}) {
  return (
    <DefaultLogicalSidebarKpis snapshot={snapshot} />
  );
}

LogicalServiceSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
