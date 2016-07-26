import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalConnectionDashboardSidebar from
  'in-sdk/components/sidebar/DefaultLogicalConnectionDashboardSidebar';


export default function PhysicalJdbcConnectionSidebar({snapshot}) {
  return (
    <DefaultLogicalConnectionDashboardSidebar snapshot={snapshot} />
  );
}

PhysicalJdbcConnectionSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
