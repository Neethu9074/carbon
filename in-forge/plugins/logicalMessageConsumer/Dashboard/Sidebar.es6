import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalDashboardSidebar from 'in-sdk/components/sidebar/DefaultLogicalDashboardSidebar';


export default function LogicalMessageConsumerSidebar({snapshot}) {
  return (
    <DefaultLogicalDashboardSidebar snapshot={snapshot} />
  );
}

LogicalMessageConsumerSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
