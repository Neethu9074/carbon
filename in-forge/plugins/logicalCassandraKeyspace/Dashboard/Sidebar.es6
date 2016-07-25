import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalDashboardSidebar from 'in-sdk/components/sidebar/DefaultLogicalDashboardSidebar';


export default function LogicalCassandraKeyspaceSidebar({snapshot}) {
  return (
    <DefaultLogicalDashboardSidebar snapshot={snapshot} />
  );
}

LogicalCassandraKeyspaceSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
