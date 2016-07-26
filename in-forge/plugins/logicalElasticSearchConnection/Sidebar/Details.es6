import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalConnectionSidebar from 'in-sdk/components/sidebar/DefaultLogicalConnectionSidebar';


export default function LogicalElasticSearchConnectionSidebar({snapshot}) {
  return (
    <DefaultLogicalConnectionSidebar snapshot={snapshot} />
  );
}

LogicalElasticSearchConnectionSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
