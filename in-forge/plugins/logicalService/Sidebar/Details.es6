import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalSidebar from 'in-sdk/components/sidebar/DefaultLogicalSidebar';


export default function LogicalServiceSidebar({snapshot}) {
  return (
    <DefaultLogicalSidebar snapshot={snapshot} />
  );
}

LogicalServiceSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
