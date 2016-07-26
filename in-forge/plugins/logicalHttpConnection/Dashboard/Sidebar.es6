import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalConnectionDashboardSidebar from
  'in-sdk/components/sidebar/DefaultLogicalConnectionDashboardSidebar';


export default function LogicalHttpConnectionSidebar({snapshot}) {
  return (
    <DefaultLogicalConnectionDashboardSidebar snapshot={snapshot} />
  );
}

LogicalHttpConnectionSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
