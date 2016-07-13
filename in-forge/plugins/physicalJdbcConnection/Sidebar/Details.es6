import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalSidebarKpis from 'in-components/DefaultLogicalSidebarKpis/DefaultLogicalSidebarKpis';


export default function PhysicalJdbcConnectionSidebar({snapshot}) {
  return (
    <DefaultLogicalSidebarKpis snapshot={snapshot} />
  );
}

PhysicalJdbcConnectionSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
