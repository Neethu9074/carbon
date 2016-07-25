import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalDashboardSidebar from 'in-sdk/components/sidebar/DefaultLogicalDashboardSidebar';


export default function LogicalDatabaseSidebar({snapshot}) {
  return (
    <DefaultLogicalDashboardSidebar snapshot={snapshot} />
  );
}

LogicalDatabaseSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
