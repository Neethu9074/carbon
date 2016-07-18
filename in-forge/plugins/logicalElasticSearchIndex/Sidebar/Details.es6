import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalSidebarKpis from 'in-components/DefaultLogicalSidebarKpis/DefaultLogicalSidebarKpis';


export default function LogicalElasticSearchIndexSidebar({snapshot}) {
  return (
    <DefaultLogicalSidebarKpis snapshot={snapshot} />
  );
}

LogicalElasticSearchIndexSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
