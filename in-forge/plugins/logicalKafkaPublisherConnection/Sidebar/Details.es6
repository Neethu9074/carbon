import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalConnectionSidebar from 'in-sdk/components/sidebar/DefaultLogicalConnectionSidebar';


export default function LogicalKafkaPublisherConnectionSidebar({snapshot}) {
  return (
    <DefaultLogicalConnectionSidebar snapshot={snapshot} />
  );
}

LogicalKafkaPublisherConnectionSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
