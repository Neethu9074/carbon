import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalSidebar from 'in-sdk/components/sidebar/DefaultLogicalSidebar';


export default function LogicalElasticSearchIndexSidebar({snapshot}) {
  return (
    <DefaultLogicalSidebar snapshot={snapshot} />
  );
}

LogicalElasticSearchIndexSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
