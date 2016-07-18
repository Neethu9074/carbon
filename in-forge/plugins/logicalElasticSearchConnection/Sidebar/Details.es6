import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalSidebarKpis from 'in-components/DefaultLogicalSidebarKpis/DefaultLogicalSidebarKpis';


export default function LogicalElasticSearchConnectionSidebar({snapshot}) {
  return (
    <DefaultLogicalSidebarKpis snapshot={snapshot} />
  );
}

LogicalElasticSearchConnectionSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
