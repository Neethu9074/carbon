import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalConnectionSidebar from 'in-sdk/components/sidebar/DefaultLogicalConnectionSidebar';


export default function PhysicalElasticSearchConnectionSidebar({snapshot}) {
  return (
    <DefaultLogicalConnectionSidebar snapshot={snapshot} />
  );
}

PhysicalElasticSearchConnectionSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
