import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalConnectionSidebar from 'in-sdk/components/sidebar/DefaultLogicalConnectionSidebar';


export default function LogicalRabbitMqConsumerConnectionSidebar({snapshot}) {
  return (
    <DefaultLogicalConnectionSidebar snapshot={snapshot} />
  );
}

LogicalRabbitMqConsumerConnectionSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
