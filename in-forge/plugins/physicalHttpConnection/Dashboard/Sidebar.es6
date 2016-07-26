import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalConnectionDashboardSidebar from
  'in-sdk/components/sidebar/DefaultLogicalConnectionDashboardSidebar';


export default function PhysicalHttpConnectionSidebar({snapshot}) {
  return (
    <DefaultLogicalConnectionDashboardSidebar snapshot={snapshot} />
  );
}

PhysicalHttpConnectionSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
