import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalDashboardSidebar from 'in-sdk/components/sidebar/DefaultLogicalDashboardSidebar';


export default function LogicalMessageBrokerSidebar({snapshot}) {
  return (
    <DefaultLogicalDashboardSidebar snapshot={snapshot} />
  );
}

LogicalMessageBrokerSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
