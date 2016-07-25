import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalDashboardSidebar from 'in-sdk/components/sidebar/DefaultLogicalDashboardSidebar';


export default function LogicalElasticSearchIndexSidebar({snapshot}) {
  return (
    <DefaultLogicalDashboardSidebar snapshot={snapshot} />
  );
}

LogicalElasticSearchIndexSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
