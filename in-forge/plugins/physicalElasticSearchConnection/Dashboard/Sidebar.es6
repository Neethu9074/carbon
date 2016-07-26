import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalConnectionDashboardSidebar from
  'in-sdk/components/sidebar/DefaultLogicalConnectionDashboardSidebar';


export default function PhysicalElasticSearchConnectionSidebar({snapshot}) {
  return (
    <DefaultLogicalConnectionDashboardSidebar snapshot={snapshot} />
  );
}

PhysicalElasticSearchConnectionSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
