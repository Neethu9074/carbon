import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalConnectionSidebar from 'in-sdk/components/sidebar/DefaultLogicalConnectionSidebar';


export default function PhysicalRabbitMqPublisherConnectionSidebar({snapshot}) {
  return (
    <DefaultLogicalConnectionSidebar snapshot={snapshot} />
  );
}

PhysicalRabbitMqPublisherConnectionSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
