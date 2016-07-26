import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalSidebar from 'in-sdk/components/sidebar/DefaultLogicalSidebar';


export default function LogicalDatabaseSidebar({snapshot}) {
  return (
    <DefaultLogicalSidebar snapshot={snapshot} />
  );
}

LogicalDatabaseSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
