import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalConnectionSidebar from 'in-sdk/components/sidebar/DefaultLogicalConnectionSidebar';


export default function PhysicalHttpConnectionSidebar({snapshot}) {
  return (
    <DefaultLogicalConnectionSidebar snapshot={snapshot} />
  );
}

PhysicalHttpConnectionSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
