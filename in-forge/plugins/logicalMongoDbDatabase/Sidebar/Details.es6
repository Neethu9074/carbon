import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalSidebar from 'in-sdk/components/sidebar/DefaultLogicalSidebar';


export default function LogicalMongoDBDatabaseSidebar({snapshot}) {
  return (
    <DefaultLogicalSidebar snapshot={snapshot} />
  );
}

LogicalMongoDBDatabaseSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
