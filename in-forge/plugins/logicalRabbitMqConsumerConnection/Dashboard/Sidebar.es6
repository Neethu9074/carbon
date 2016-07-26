import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalConnectionDashboardSidebar from
  'in-sdk/components/sidebar/DefaultLogicalConnectionDashboardSidebar';


export default function LogicalRabbitMqConsumerConnectionSidebar({snapshot}) {
  return (
    <DefaultLogicalConnectionDashboardSidebar snapshot={snapshot} />
  );
}

LogicalRabbitMqConsumerConnectionSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
